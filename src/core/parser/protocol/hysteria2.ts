import type { Hysteria2Config } from '../types';
import { hasKey } from '../../../shared';
import { Faker } from '../../../shared/faker';
import { PsUtil } from '../../../shared/ps';

export class Hysteria2Parser extends Faker {
    /** * @description 原始链接 */
    #originLink: string = '';

    /** * @description 混淆链接 */
    #confuseLink: string = '';

    /** * @description vps原始配置 */
    #originConfig: Partial<Hysteria2Config> = {};

    /** * @description 混淆配置 */
    #confuseConfig: Partial<Hysteria2Config> = {};

    /** * @description 原始备注 */
    #originPs: string = '';

    /** * @description 混淆备注 */
    #confusePs: string = '';

    constructor(v: string) {
        super();
        this.#confusePs = crypto.randomUUID();
        // 设置原始配置
        this.setOriginConfig(v);
        // 设置混淆配置
        this.setConfuseConfig(v);
    }

    /**
     * @description 设置原始配置
     * @param {string} v
     */
    private setOriginConfig(v: string): void {
        this.#originLink = v;
        this.#originConfig = new URL(v);
        this.#originPs = this.#originConfig.hash ?? '';
    }

    /**
     * @description 更新原始配置
     * @param {string} ps
     */
    public updateOriginConfig(ps: string): void {
        this.#originConfig.hash = ps;
        this.#originPs = ps;
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
        this.#confuseConfig.host = this.getHost();
        this.#confuseConfig.hostname = this.getHostName();
        this.#confuseConfig.port = this.getPort();
        this.#confuseConfig.hash = PsUtil.setPs(this.#originPs, this.#confusePs);
        this.#confuseLink = this.#confuseConfig.href!;
    }

    public restoreClash(proxy: Record<string, any>, ps: string): Record<string, any> {
        proxy.name = ps;
        proxy.server = this.originConfig.hostname ?? '';
        proxy.port = Number(this.originConfig.port ?? 0);
        if (proxy.type === 'hysteria2' && hasKey(proxy, 'password')) {
            // 从URL的username部分获取password
            const password = this.originConfig.username || this.originConfig?.searchParams?.get('password');
            proxy.password = password || 'default_password';
        }

        // 处理insecure参数，转换为skip-cert-verify
        if (this.originConfig.searchParams?.has('insecure')) {
            const insecure = this.originConfig.searchParams.get('insecure');
            if (insecure === '1') {
                proxy['skip-cert-verify'] = true;
            }
        }

        // 处理mport参数，转换为ports和mport
        if (this.originConfig.searchParams?.has('mport')) {
            const mport = this.originConfig.searchParams.get('mport');
            if (mport) {
                proxy.ports = mport;
                proxy.mport = mport;
        }
        }

        // 添加udp字段
        proxy.udp = true;

        if (hasKey(proxy, 'down')) {
            proxy.down =
                proxy.down !== ''
                    ? proxy.down
                    : (this.originConfig.searchParams?.get('down') ?? this.originConfig.searchParams?.get('downmbps') ?? 0);
        }
        if (hasKey(proxy, 'up')) {
            proxy.up =
                proxy.up !== ''
                    ? proxy.up
                    : (this.originConfig.searchParams?.get('up') ?? this.originConfig.searchParams?.get('upmbps') ?? 0);
        }
        if (hasKey(proxy, 'delay')) {
            proxy.delay = this.originConfig.searchParams?.get('delay') ?? 0;
        }

        if (this.originConfig.searchParams?.has('sni')) {
            proxy.sni = this.originConfig.searchParams?.get('sni') ?? '';
        }

        return proxy;
    }

    public restoreSingbox(outbound: Record<string, any>, ps: string): Record<string, any> {
        // 从URL的username部分获取password
        const password = this.originConfig.username || this.originConfig?.searchParams?.get('password');
        outbound.password = password || 'default_password';
        outbound.server = this.originConfig.hostname ?? '';
        outbound.server_port = Number(this.originConfig.port ?? 0);
        outbound.tag = ps;

        // 处理insecure参数，转换为skip-cert-verify
        if (this.originConfig.searchParams?.has('insecure')) {
            const insecure = this.originConfig.searchParams.get('insecure');
            if (insecure === '1') {
                outbound['skip-cert-verify'] = true;
            }
        }

        // 处理mport参数，转换为ports和mport
        if (this.originConfig.searchParams?.has('mport')) {
            const mport = this.originConfig.searchParams.get('mport');
            if (mport) {
                outbound.ports = mport;
                outbound.mport = mport;
            }
        }

        // 添加udp字段
        outbound.udp = true;

        if (outbound.down) {
            outbound.down = decodeURIComponent(outbound.down as string);
        }
        if (outbound.up) {
            outbound.up = decodeURIComponent(outbound.up as string);
        }
        return outbound;
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
     * @example 'trojan://...'
     */
    get originLink(): string {
        return this.#originLink;
    }

    /**
     * @description 原始配置
     */
    get originConfig(): Partial<Hysteria2Config> {
        return this.#originConfig;
    }

    /**
     * @description 混淆备注
     * @example 'confusePs'
     */
    get confusePs(): string {
        return encodeURIComponent(this.#confusePs);
    }

    /**
     * @description 混淆链接
     * @example 'trojan://...'
     */
    get confuseLink(): string {
        return this.#confuseLink;
    }

    /**
     * @description 混淆配置
     */
    get confuseConfig(): Partial<Hysteria2Config> {
        return this.#confuseConfig;
    }
}

