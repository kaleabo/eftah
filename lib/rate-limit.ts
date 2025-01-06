export function rateLimit({
    interval,
    uniqueTokenPerInterval,
  }: {
    interval: number;
    uniqueTokenPerInterval: number;
  }) {
    const tokenCache = new Map();
    let lastInterval = Date.now();
  
    return {
      async check(limit: number, token: string) {
        const now = Date.now();
        if (now - lastInterval >= interval) {
          lastInterval = now;
          tokenCache.clear();
        }
  
        const tokenCount = (tokenCache.get(token) || 0) + 1;
  
        if (tokenCount > limit) {
          throw new Error('Rate limit exceeded');
        }
  
        tokenCache.set(token, tokenCount);
      },
    };
  }