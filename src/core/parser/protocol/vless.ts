import type { VlessConfig } from '../types';
import { Faker } from '../../../shared/faker';
import { PsUtil } from '../../../shared/ps';

// Use crypto and URL from global scope
declare const crypto: {
    randomUUID(): string;
};
declare const URL: {
    new (url: string): URL;
    prototype: URL;
};
interface URL {
    hash: string;
    hostname: string;
    username: string;
    port: string;
    href: string;
    searchParams: {
        get(name: string): string | null;
    };
}

/**
 * Check if a string is an IP address
 */
function isIP(str: string): boolean {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return ipv4Regex.test(str) || ipv6Regex.test(str);
}

export class VlessParser extends Faker {
    /** * @description 原始链接 */
    #originLink: string = '';

    /** * @description 混淆链接 */
    #confuseLink: string = '';

    /** * @description vps原始配置 */
    #originConfig: URL = new URL('vless://localhost');

    /** * @description 混淆配置 */
    #confuseConfig: URL = new URL('vless://localhost');

    /** * @description 原始备注 */
    #originPs: string = '';

    /** * @description 混淆备注 */
    #confusePs: string = '';

    /** * @description subscription-userinfo */
    #subscriptionUserInfo: string = '';

    /** * @description Request headers */
    static readonly headers = {
        "User-Agent": "clash.meta"
    };

    constructor(v: string, headers?: Record<string, string>) {
        super();
        this.#confusePs = crypto.randomUUID();
        // 设置原始配置
        this.setOriginConfig(v);
        // 设置混淆配置
        this.setConfuseConfig(v);
        // 保存 subscription-userinfo
        if (headers?.["subscription-userinfo"]) {
            this.#subscriptionUserInfo = headers["subscription-userinfo"];
        }
    }

    /**
     * @description 设置原始配置
     * @param {string} v
     */
    private setOriginConfig(v: string): void {
        this.#originLink = v;
        this.#originConfig = new URL(v);
        this.#originPs = PsUtil.formatPs(this.#originConfig.hash) ?? '';
    }

    /**
     * @description 更新原始配置
     * @param {string} ps
     */
    public updateOriginConfig(ps: string): void {
        this.#originConfig.hash = PsUtil.formatPs(ps);
        this.#originPs = PsUtil.formatPs(ps);
        this.#originLink = this.#originConfig.href!;
        this.setConfuseConfig(this.#originLink);
    }

    /**
     * @description 设置混淆配置
     * @param {string} v
     */
    private setConfuseConfig(v: string): void {
        this.#confuseConfig = new URL(v);
        this.#confuseConfig.username = this.getUsername();
        this.#confuseConfig.hostname = this.getHostName();
        this.#confuseConfig.port = this.getPort();
        this.#confuseConfig.hash = PsUtil.setPs(this.#originPs, this.#confusePs);
        this.#confuseLink = this.#confuseConfig.href!;
    }

    public restoreSingbox(outbound: Record<string, any>, ps: string): Record<string, any> {
        // Basic configuration
        outbound.type = "vless";
        outbound.tag = ps;
        outbound.server = this.#originConfig.hostname;
        outbound.server_port = Number(this.#originConfig.port) || 0;
        outbound.uuid = this.#originConfig.username;

        // Get security type
        const security = this.#originConfig.searchParams.get("security") || "none";

        // Handle Reality settings
        if (security === "reality") {
            const sni = this.#originConfig.searchParams.get("sni") || '';
            const publicKey = this.#originConfig.searchParams.get("pbk") || '';
            const shortId = this.#originConfig.searchParams.get("sid") || '';
            const fingerprint = this.#originConfig.searchParams.get("fp") || 'chrome';

            outbound.tls = {
                enabled: true,
                server_name: sni,
                reality: {
                    enabled: true,
                    public_key: publicKey,
                    short_id: shortId
                },
                utls: {
                    enabled: true,
                    fingerprint: fingerprint
                }
            };
        } else if (security === "tls") {
            // TLS configuration
            const sni = this.#originConfig.searchParams.get("sni") ||
                       this.#originConfig.searchParams.get("servername") ||
                       this.#originConfig.searchParams.get("host") ||
                       this.#originConfig.hostname;

            const tls: Record<string, any> = {
                enabled: true,
                insecure: true,
                disable_sni: false
            };

            // Only set server_name for non-IP addresses
            if (sni && !isIP(sni)) {
                tls.server_name = sni;
            }

            // Handle uTLS fingerprint
            const fingerprint = this.#originConfig.searchParams.get("fp");
            if (fingerprint) {
                tls.utls = {
                    enabled: true,
                    fingerprint: fingerprint
                };
            }

            outbound.tls = tls;
        }

        // Handle flow settings
        const flow = this.#originConfig.searchParams.get("flow");
        if (flow) {
            outbound.flow = flow;
        }

        // Save subscription info
        if (this.#subscriptionUserInfo) {
            outbound.subscription_userinfo = this.#subscriptionUserInfo;
        }

        return outbound;
    }

    public restoreClash(proxy: Record<string, any>, ps: string): Record<string, any> {
        proxy.name = ps;
        proxy.server = this.originConfig.hostname ?? '';
        proxy.port = Number(this.originConfig.port ?? 0);
        proxy.uuid = this.originConfig.username ?? '';

        // TLS configuration
        const sni = this.originConfig.searchParams.get("sni") ||
                   this.originConfig.searchParams.get("servername") ||
                   this.originConfig.searchParams.get("host") ||
                   this.originConfig.hostname;

        // 只在非 IP 地址时设置 server_name
        if (sni && !isIP(sni)) {
            proxy.sni = sni;
        } else {
            proxy.sni = "";
        }

        // Always set skip-cert-verify to true (1)
        proxy["skip-cert-verify"] = true;

        // 处理 ALPN
        if (proxy.alpn) {
            proxy.alpn = Array.isArray(proxy.alpn) ? proxy.alpn.map((i: string) => decodeURIComponent(i)) : proxy.alpn;
        }

        // 保存订阅信息
        if (this.#subscriptionUserInfo) {
            proxy["subscription-userinfo"] = this.#subscriptionUserInfo;
        }

        return proxy;
    }

    /**
     * @description 原始备注
     * @example '#originPs'
     */
    get originPs(): string {
        return this.#originPs;
    }

    /**
     * @description 原始链接
     * @example 'vless://...'
     */
    get originLink(): string {
        return this.#originLink;
    }

    /**
     * @description 原始配置
     */
    get originConfig(): URL {
        return this.#originConfig;
    }

    /**
     * @description 混淆备注
     * @example 'confusePs'
     */
    get confusePs(): string {
        return this.#confusePs;
    }

    /**
     * @description 混淆链接
     * @example 'vless://...'
     */
    get confuseLink(): string {
        return this.#confuseLink;
    }

    /**
     * @description 混淆配置
     */
    get confuseConfig(): URL {
        return this.#confuseConfig;
    }

    /**
     * @description Get request headers
     */
    static getHeaders(): Record<string, string> {
        return this.headers;
    }
}

