import logger from '../../log/Logger'
import * as events from 'events'
import NotificationService from '../notification/NotificationService'
import PrayerSubscriptionService from '../prayerSubscription/PrayerSubscriptionService'

class PrayerEvents {

  private eventEmitter: events.EventEmitter = new events.EventEmitter()
  private notificationService: NotificationService = new NotificationService()
  private subscriptionService: PrayerSubscriptionService = new PrayerSubscriptionService()

  constructor() {
    this.eventEmitter.on('DELETED_PRAYER_EVENT', this.listenToDeletedPrayerEvent)
  }

  emitDeletePrayerEvent = (event: DeletedPrayerEvent) => {
    logger.log('info', 'Emiting DELETED_PRAYER_EVENT with data: ', event)
    this.eventEmitter.emit('DELETED_PRAYER_EVENT', event)
  }

  private listenToDeletedPrayerEvent = async (event: DeletedPrayerEvent) => {
    try {
      logger.log('info', `Received event DELETED_PRAYER_EVENT with data: ${event}.`)
      const deletedNo = await this.notificationService.deleteNotificationsForPrayer(event.prayerId)
      logger.log('info', `${deletedNo} notifications were deleted due to prayer ${event.prayerId} beeing deleted. `)
      const deletedSubscriptions = await this.subscriptionService.deletePrayerSubscriptions(event.prayerId)
      logger.log('info', `${deletedSubscriptions} prayer subscriptions were deleted due to prayer ${event.prayerId} beeing deleted. `)
    } catch (error) {
      logger.log('error', `Failed to delete notifications for deleted prayer ${event.prayerId}`)
    }
  }
}

export interface DeletedPrayerEvent {
  prayerId: number
}

export default new PrayerEvents()