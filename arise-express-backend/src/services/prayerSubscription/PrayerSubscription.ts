export default interface PrayerSubscription {
    SubscriptionId: number
    UserId: number
    PrayerId: number
    Author: string
    PrayerAuthorId: number
    PrayerTitle: string
    PrayerContent: string
    ReactionsCounter: number
    CommentsCounter: number
    CreationDate?: Date
}