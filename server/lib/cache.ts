import NodeCache from "node-cache"

class CacheService {
  private cache: NodeCache

  constructor() {
    this.cache = new NodeCache({
      stdTTL: 600, // 10 minutes default TTL
      checkperiod: 120, // Check for expired keys every 2 minutes
      useClones: false,
    })
  }

  get<T>(key: string): T | undefined {
    return this.cache.get<T>(key)
  }

  set<T>(key: string, value: T, ttl?: number): boolean {
    return this.cache.set(key, value, ttl || 600)
  }

  del(key: string): number {
    return this.cache.del(key)
  }

  flush(): void {
    this.cache.flushAll()
  }

  keys(): string[] {
    return this.cache.keys()
  }

  // Cache with automatic refresh
  async getOrSet<T>(key: string, fetchFunction: () => Promise<T>, ttl?: number): Promise<T> {
    const cached = this.get<T>(key)
    if (cached !== undefined) {
      return cached
    }

    const fresh = await fetchFunction()
    this.set(key, fresh, ttl)
    return fresh
  }
}

export const cache = new CacheService()
