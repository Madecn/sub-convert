import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { UrlService } from './services/url.service';
import { showPage } from './page/page';

// 创建Hono应用
const app = new Hono();

// 中间件
app.use('*', logger());
app.use('*', cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'User-Agent'],
}));

// 环境变量类型定义
interface Env {
    BACKEND?: string;
    DEFAULT_BACKEND?: string;
    LOCK_BACKEND?: boolean;
    CUSTOM_BACKEND?: string;
    REMOTE_CONFIG?: string;
    DB?: string;
    CHUNK_COUNT?: string;
}

// 创建环境变量对象（适配Node.js环境）
const env = {
    BACKEND: process.env.BACKEND,
    DEFAULT_BACKEND: process.env.DEFAULT_BACKEND,
    LOCK_BACKEND: process.env.LOCK_BACKEND === 'true' ? true : undefined,
    CUSTOM_BACKEND: process.env.CUSTOM_BACKEND,
    REMOTE_CONFIG: process.env.REMOTE_CONFIG,
    CHUNK_COUNT: process.env.CHUNK_COUNT,
    // Node.js环境不支持D1数据库
    DB: undefined
} as Env;

// 创建URL服务实例（不传入数据库，因为Node.js环境不支持D1）
const urlService = new UrlService();

// 根路由 - 返回网页UI
app.get('/', async (c) => {
    try {
        const request = new Request(c.req.url);
        const response = showPage(request, env);
        return response;
    } catch (error: any) {
        console.error('Error in root route:', error);
        return c.json({ error: error.message || 'Internal server error' }, 500);
    }
});

// 健康检查路由
app.get('/health', (c) => {
    return c.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        features: {
            subscription_conversion: true,
            short_url_service: false,
            reason: 'Short URL service requires Cloudflare D1 database'
        }
    });
});

// API文档路由
app.get('/api', (c) => {
    return c.json({
        name: 'sub-convert',
        version: '0.0.1',
        description: '订阅转换工具',
        environment: 'Node.js',
        endpoints: {
            '/sub': '订阅转换 (可用)',
            '/short': '创建短链 (需要数据库)',
            '/:code': '短链重定向 (需要数据库)',
            '/health': '健康检查'
        },
        note: '短链服务需要Cloudflare D1数据库，在Node.js环境中不可用'
    });
});

// 订阅转换路由
app.get('/sub', async (c) => {
    try {
        const url = new URL(c.req.url);
        const target = url.searchParams.get('target') || 'clash';
        const vpsUrl = url.searchParams.get('url');
        
        if (!vpsUrl) {
            return c.json({ error: 'Missing url parameter' }, 400);
        }

        // 创建Request对象
        const request = new Request(c.req.url);
        
        // 调用URL服务
        const response = await urlService.toSub(request, env, target);
        
        // 获取响应内容
        const responseText = await response.text();
        const responseHeaders = response.headers;
        
        // 设置响应头
        responseHeaders.forEach((value, key) => {
            c.header(key, value);
        });
        
        return c.text(responseText);
    } catch (error: any) {
        console.error('Error in /sub route:', error);
        return c.json({ error: error.message || 'Internal server error' }, 500);
    }
});

// 短链服务路由（需要数据库支持）
app.post('/short', async (c) => {
    try {
        return c.json({ error: 'Short URL service requires database support. Not available in Node.js environment.' }, 501);
    } catch (error: any) {
        console.error('Error in /short route:', error);
        return c.json({ error: error.message || 'Internal server error' }, 500);
    }
});

// 短链重定向路由（需要数据库支持）- 放在最后
app.get('/:code', async (c) => {
    try {
        return c.json({ error: 'Short URL service requires database support. Not available in Node.js environment.' }, 501);
    } catch (error: any) {
        console.error('Error in short URL redirect:', error);
        return c.json({ error: error.message || 'Internal server error' }, 500);
    }
});

export default app; 