import type { Request, Response, NextFunction } from "express"
import { cache } from "../lib/cache"

export const cacheMiddleware = (ttl = 300) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== "GET") {
      return next()
    }

    const key = `cache:${req.originalUrl}`
    const cached = cache.get(key)

    if (cached) {
      return res.json(cached)
    }

    // Store original json method
    const originalJson = res.json

    // Override json method to cache response
    res.json = function (body: any) {
      cache.set(key, body, ttl)
      return originalJson.call(this, body)
    }

    next()
  }
}
