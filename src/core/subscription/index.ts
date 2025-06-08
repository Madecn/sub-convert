import { fetchWithRetry } from 'cloudflare-tools';

export class Subscription {
    private subscriptionInfo: string | null = null;

    constructor() {}

    /**
     * 获取订阅信息
     * @param urls 订阅链接数组
     */
    async fetchSubscriptionInfo(urls: string[]): Promise<void> {
        try {
            // 使用 clash.meta 作为 User-Agent 获取订阅信息
            const responses = await Promise.all(
                urls.map(url =>
                    fetchWithRetry(url, {
                        retries: 3,
                        headers: { "User-Agent": "clash.meta" }
                    }).then(res => res.data.headers.get("subscription-userinfo")).catch(() => null)
                )
            );
            
            // 找到第一个有效的订阅信息
            this.subscriptionInfo = responses.find(info => info) || null;
        } catch (error) {
            console.error('Failed to fetch subscription info:', error);
            this.subscriptionInfo = null;
        }
    }

    /**
     * 获取订阅信息
     */
    getSubscriptionInfo(): string | null {
        return this.subscriptionInfo;
    }

    /**
     * 设置订阅信息
     */
    setSubscriptionInfo(info: string | null): void {
        this.subscriptionInfo = info;
    }

    /**
     * 添加订阅信息到响应头
     */
    addSubscriptionInfoToResponse(response: Response): Response {
        if (!this.subscriptionInfo) {
            return response;
        }

        const headers = new Headers(response.headers);
        headers.set("subscription-userinfo", this.subscriptionInfo);
        
        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: headers
        });
    }
} 