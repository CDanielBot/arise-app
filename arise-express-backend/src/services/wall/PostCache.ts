import Cache from '../Cache'
import { WallPost, Limit } from './Post'

export const KEY_LATEST_POSTS = 'Wall_Load_Posts_Latest'

class PostCache {

  private cache: Cache<Array<WallPost>>

  constructor(ttlSeconds: number) {
    this.cache = new Cache(ttlSeconds)
  }

  public get(limit: Limit, loadData: () => Promise<Array<WallPost>>): Promise<Array<WallPost>> {
    const cacheKey = limit.LastLoadedPostId > 0
      ? `Wall_Load_Posts_LastLoadedPostId_${limit.LastLoadedPostId}`
      : KEY_LATEST_POSTS

    return this.cache.get(cacheKey, loadData)
  }

  public invalidateCacheKey(key: string) {
    this.cache.del(key)
  }
}

export default new PostCache(30)