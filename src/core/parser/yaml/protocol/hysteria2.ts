/**
 * 将 Hysteria2 配置对象转换为 Hysteria2 标准协议 URL
 * @param {object} config - Hysteria2 配置对象
 * @returns {string} Hysteria2 标准协议 URL (hysteria2://...)
 * @throws {Error} 如果缺少必要的配置字段
 */
export function hysteria2Convert(config: Record<string, any>): string {
    if (!config || !config.server || !config.port || !config.password) {
        throw new Error('Hysteria2 configuration object must contain server, port, and password.');
    }

    const server = config.server;
    const port = config.port;
    const password = config.password;
    const remarks = config.name || '';

    const parameters = new URLSearchParams();

    // 基本参数
    parameters.append('password', password);

    // TLS/安全性 相关参数
    // 优先级：sni > servername > host > server
    const sni = config.sni || config.servername || config.host || config.server;
    if (sni) {
        parameters.append('sni', sni);
    }

    // TLS 配置
    if (config.tls) {
        // insecure 参数对应 skip-cert-verify 或 tls.insecure
        if (config.tls.insecure || config.insecure || config['skip-cert-verify']) {
            parameters.append('insecure', '1');
        }
        // ALPN 配置
        if (config.tls.alpn) {
            const alpn = Array.isArray(config.tls.alpn) ? config.tls.alpn.join(',') : config.tls.alpn;
            parameters.append('alpn', alpn);
        }
    } else {
        // 兼容旧配置
        if (config.insecure || config['skip-cert-verify']) {
            parameters.append('insecure', '1');
        }
        if (config.alpn) {
            const alpn = Array.isArray(config.alpn) ? config.alpn.join(',') : config.alpn;
            parameters.append('alpn', alpn);
        }
    }

    // 混淆 Obfs 参数
    if (config.obfs) {
        parameters.append('obfs', config.obfs);
    }
    if (config['obfs-param']) {
        parameters.append('obfs-param', config['obfs-param']);
    }

    // 上下行速率
    if (config.up) {
        parameters.append('up', config.up.toString());
    }
    if (config.down) {
        parameters.append('down', config.down.toString());
    }

    // 订阅信息
    if (config.subscription_userinfo || config['subscription-userinfo']) {
        const userInfo = config.subscription_userinfo || config['subscription-userinfo'];
        parameters.append('subscription-userinfo', userInfo);
    }

    const queryString = parameters.toString();
    const encodedServer = encodeURIComponent(server);
    const encodedRemarks = encodeURIComponent(remarks);

    let hysteria2Url = `hysteria2://${encodedServer}:${port}`;
    if (queryString) {
        hysteria2Url += `?${queryString}`;
    }
    if (remarks) {
        hysteria2Url += `#${encodedRemarks}`;
    }

    return hysteria2Url;
}

