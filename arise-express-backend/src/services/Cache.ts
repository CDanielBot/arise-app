
import * as NodeCache from 'node-cache'

export default class Cache<T> {

  private ttl: number
  private cache: NodeCache

  constructor(ttlSeconds: number) {
    this.ttl = ttlSeconds
    this.cache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false });
  }

  async get<T>(key: string, crudFunction: () => Promise<T>): Promise<T> {
    const value: T = this.cache.get(key)
    if (value) {
      return value
    }

    const result: T = await crudFunction()
    this.cache.set(key, result)
    return result
  }

  keys() {
    return this.cache.keys()
  }

  del(keys: string) {
    this.cache.del(keys)
  }

  delStartWith(startStr: string = '') {
    if (!startStr) {
      return
    }

    const keys = this.cache.keys()
    for (const key of keys) {
      if (key.indexOf(startStr) === 0) {
        this.del(key)
      }
    }
  }

  set(key: string, t: T): boolean {
    return this.cache.set(key, t, this.ttl)
  }

  flush() {
    this.cache.flushAll()
  }
}