import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.ts',
            formats: ['es'],
            fileName: 'index'
        },
        minify: false, // Node.js环境不需要压缩
        outDir: 'dist',
        rollupOptions: {
            external: [
                '@hono/node-server',
                'hono',
                'hono/cors', 
                'hono/logger',
                'cloudflare-tools',
                'js-yaml'
            ]
        },
        target: 'node18'
    },
    esbuild: {
        target: 'node18'
    },
    define: {
        'process.env': 'process.env'
    }
}); 