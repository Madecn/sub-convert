import { serve } from '@hono/node-server';
import app from './server.js';

const port = parseInt(process.env.PORT || '8787');

console.log(`🚀 Server is running on port ${port}`);

serve({
    fetch: app.fetch,
    port
});

