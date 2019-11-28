import logger from '../../log/Logger'
import * as events from 'events'
import cache, { KEY_LATEST_POSTS } from './PostCache'

class PostCacheEvents {

  private eventEmitter: events.EventEmitter = new events.EventEmitter()

  constructor() {
    this.eventEmitter.on('DELETE_CACHE_KEY_EVENT', this.listenToDelCacheKey)
  }

  triggerInvalidateLatest = () => {
    logger.log('info', 'Emiting DELETE_CACHE_KEY_EVENT for cache key: ', KEY_LATEST_POSTS)
    this.eventEmitter.emit('DELETE_CACHE_KEY_EVENT', KEY_LATEST_POSTS)
  }

  private listenToDelCacheKey = async (cacheKey: string) => {
    cache.invalidateCacheKey(cacheKey)
  }
}

export default new PostCacheEvents()