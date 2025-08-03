/**
 * 将 Hysteria2 配置对象转换为 Hysteria2 标准协议 URL
 * @param {object} config - Hysteria2 配置对象
 * @returns {string} Hysteria2 标准协议 URL (hysteria2://...)
 * @throws {Error} 如果缺少必要的配置字段
 */
export function hysteria2Convert(config: Record<string, any>): string {
    if (!config || !config.server || !config.port) {
        throw new Error('Hysteria2 configuration object must contain server and port.');
    }

    const server = config.server;
    const port = config.port;
    const password = config.password || 'default_password'; // 添加默认密码
    const remarks = config.name || '';

    const parameters = new URLSearchParams();

    parameters.append('password', password);

    // TLS/安全性 相关参数
    const sni = config.sni || config.servername || config.server;
    if (sni) {
        parameters.append('sni', sni);
    }
    // insecure 参数对应 skip-cert-verify
    if (config.insecure || config['skip-cert-verify'] || config['skip-cert-verify'] === true) {
        parameters.append('insecure', '1');
    } else if (config['skip-cert-verify'] === false) {
        // 当skip-cert-verify为false时，强制设置为true
        parameters.append('insecure', '1');
    }
    if (config.alpn && (typeof config.alpn === 'string' || Array.isArray(config.alpn))) {
        parameters.append('alpn', Array.isArray(config.alpn) ? config.alpn.join(',') : config.alpn);
    }

    // 混淆 Obfs 参数 (H2 的 obfs 类型可能与 H1 不同)
    if (config.obfs) {
        parameters.append('obfs', config.obfs);
    }
    if (config['obfs-param']) {
        parameters.append('obfs-param', config['obfs-param']);
    }

    if (config['obfs-password']) {
        parameters.append('obfs-password', config['obfs-password']);
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

