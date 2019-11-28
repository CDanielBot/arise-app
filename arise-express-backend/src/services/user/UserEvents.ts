import PostCrud from '../wall/PostCrud'
import ReactionCrud from '../reaction/ReactionCrud'
import CommentCrud from '../comment/CommentCrud'
import logger from '../../log/Logger'
import * as events from 'events'
import UserCrud from './UserCrud'

class UserEvents {

  private userCrud: UserCrud = new UserCrud()
  private postCrud: PostCrud = new PostCrud()
  private reactionCrud: ReactionCrud = new ReactionCrud()
  private commentCrud: CommentCrud = new CommentCrud()

  private eventEmitter: events.EventEmitter = new events.EventEmitter()

  constructor() {
    this.eventEmitter.on('UPDATE_USER_EVENT', this.listenToUpdateUserEvent)
  }

  emitUpdateUserEvent = (event: UpdateUserEvent) => {
    logger.log('info', 'Emiting UPDATE_USER_EVENT with data: ', event)
    this.eventEmitter.emit('UPDATE_USER_EVENT', event)
  }

  private listenToUpdateUserEvent = async (event: UpdateUserEvent) => {
    try {
      logger.log('info', 'Received event UPDATE_USER_EVENT with data: ', event)
      const usersNo = this.userCrud.updateUser({ User: event.username }, event.userId)
      logger.log('info', `Username updated with succes for user ${event.userId}. ${usersNo} database rows were updated.`)
      const postsNo = await this.postCrud.updatePostsForUser(event.username, event.userId)
      logger.log('info', `${postsNo} posts were updated with new username ${event.username} for user ${event.userId}`)
      const commentsNo = await this.commentCrud.updateCommentsForUser(event.username, event.userId)
      logger.log('info', `${commentsNo} comments were updated with new username ${event.username} for user ${event.userId}`)
      const reactionsNo = await this.reactionCrud.updateReactionsForUser(event.username, event.userId)
      logger.log('info', `${reactionsNo} reactions were updated with new username ${event.username} for user ${event.userId}`)
    } catch (error) {
      logger.log('error', `Failed to update cached username (new username: ${event.username}) in database for user ${event.userId}.`)
    }

  }
}

export interface UpdateUserEvent {
  username: string
  userId: number
}

export default new UserEvents()