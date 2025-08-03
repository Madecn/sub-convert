import type { ShortUrl } from '../types';
import { dump } from 'js-yaml';
import { Confuse } from '../core/confuse';
import { Restore } from '../core/restore';
import { ResponseUtil } from '../shared/response';

export class UrlService {
    constructor(private db?: D1Database) {}

    async toSub(request: Request, env: Env, convertType: string): Promise<Response> {
        try {
            const confuse = new Confuse(env);
            await confuse.setSubUrls(request);

            const restore = new Restore(confuse);
            let response: Response;
            let subscriptionUserinfo: string | undefined;

            // 获取订阅头信息
            if (confuse.subscriptionUserinfo) {
                subscriptionUserinfo = confuse.subscriptionUserinfo;
            }

            if (['clash', 'clashr'].includes(convertType)) {
                const originConfig = await restore.getClashConfig();
                response = new Response(dump(originConfig, { indent: 2, lineWidth: 200 }), {
                    headers: new Headers({
                        'Content-Type': 'text/yaml; charset=UTF-8',
                        'Cache-Control': 'no-store'
                    })
                });
            } else if (convertType === 'singbox') {
                const originConfig = await restore.getSingboxConfig();
                response = new Response(JSON.stringify(originConfig), {
                    headers: new Headers({
                        'Content-Type': 'text/plain; charset=UTF-8',
                        'Cache-Control': 'no-store'
                    })
                });
            } else if (convertType === 'v2ray') {
                const originConfig = await restore.getV2RayConfig();
                response = new Response(originConfig, {
                    headers: new Headers({
                        'Content-Type': 'text/plain; charset=UTF-8',
                        'Cache-Control': 'no-store'
                    })
                });
            } else {
            return ResponseUtil.error('Unsupported client type, support list: clash, singbox, v2ray');
            }

            // 添加订阅头信息到响应
            if (subscriptionUserinfo) {
                response.headers.set('subscription-userinfo', subscriptionUserinfo);
            }

            return response;
        } catch (error: any) {
            throw new Error(error.message || 'Invalid request');
        }
    }

    async add(long_url: string, baseUrl: string): Promise<ShortUrl> {
        if (!this.db) {
            throw new Error('Database is not initialized');
        }

        const code = this.generateShortCode();
        const short_url = `${baseUrl}/${code}`;

        const result = await this.db
            .prepare('INSERT INTO short_url (short_code, short_url, long_url) VALUES (?, ?, ?) RETURNING id')
            .bind(code, short_url, long_url)
            .first<{ id: number }>();

        if (!result?.id) {
            throw new Error('Failed to create short URL');
        }

        return { id: result.id, short_code: code, short_url, long_url };
    }

    async delete(id: number): Promise<void> {
        if (!this.db) {
            throw new Error('Database is not initialized');
        }

        await this.db.prepare('DELETE FROM short_url WHERE id = ?').bind(id).run();
    }

    async getById(id: number): Promise<ShortUrl | null> {
        if (!this.db) {
            throw new Error('Database is not initialized');
        }

        return await this.db.prepare('SELECT id, short_url, long_url FROM short_url WHERE id = ?').bind(id).first<ShortUrl>();
    }

    async getList(page = 1, pageSize = 10): Promise<{ total: number; items: ShortUrl[] }> {
        if (!this.db) {
            throw new Error('Database is not initialized');
        }

        const offset = (page - 1) * pageSize;
        const [total, items] = await Promise.all([
            this.db.prepare('SELECT COUNT(*) as count FROM short_url').first<{ count: number }>(),
            this.db
                .prepare('SELECT id, short_code, short_url, long_url FROM short_url LIMIT ? OFFSET ?')
                .bind(pageSize, offset)
                .all<ShortUrl>()
        ]);

        return {
            total: total?.count || 0,
            items: items?.results || []
        };
    }

    async getByShortUrl(short_url: string): Promise<ShortUrl | null> {
        if (!this.db) {
            throw new Error('Database is not initialized');
        }

        return await this.db
            .prepare('SELECT id, short_code, short_url, long_url FROM short_url WHERE short_url = ?')
            .bind(short_url)
            .first<ShortUrl>();
    }

    async getByCode(code: string): Promise<ShortUrl | null> {
        if (!this.db) {
            throw new Error('Database is not initialized');
        }

        return await this.db
            .prepare('SELECT id, short_code, short_url, long_url FROM short_url WHERE short_code = ?')
            .bind(code)
            .first<ShortUrl>();
    }

    async deleteByCode(code: string): Promise<void> {
        if (!this.db) {
            throw new Error('Database is not initialized');
        }

        await this.db.prepare('DELETE FROM short_url WHERE short_code = ?').bind(code).run();
    }

    private generateShortCode(): string {
        return crypto.randomUUID().substring(0, 8);
    }
}

