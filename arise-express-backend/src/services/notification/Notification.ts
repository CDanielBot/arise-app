export enum SeenType {
    Unseen = 0,
    Seen = 1
}

export enum PeerToPeerNotificationType {
    Comment = 'comment',
    Reply = 'reply',
    Like = 'like',
    Pray = 'pray',
}

export enum BroadcastNotificationType {
    Prayer = 'prayer',
    Video = 'video',
    Image = 'image',
    Article = 'article',
    Event = 'event'
}

export enum NotificationType {
    Broadcast = 'Broadcast',
    PeerToPeer = 'PeerToPeer'
}

export interface NotificationId {
    Id: number
    Type: NotificationType
}

export default class Notification {
    NotificationId?: number
    ActionMakerUserId: number
    ActionMakerUsername: string
    TargetUserId: number
    RelatedPostId: number
    RelatedEntityId: number
    Action: PeerToPeerNotificationType | BroadcastNotificationType
    Seen?: SeenType
    Type: NotificationType
    CreationDate?: Date

    constructor(config: NotificationCreation) {
        if (config) {
            this.ActionMakerUserId = config.ActionMakerUserId
            this.ActionMakerUsername = config.ActionMakerUsername
            this.TargetUserId = config.TargetUserId
            this.RelatedEntityId = config.RelatedEntityId
            this.RelatedPostId = config.RelatedPostId
            this.Action = config.Action
            this.Seen = config.Seen || SeenType.Unseen
            this.Type = config.Type
        }
    }

    toPeerToPeerNotification(): PeerToPeerCrudNotification {
        return {
            NotificationId: this.NotificationId,
            UserId: this.ActionMakerUserId,
            RelatedEntityId: this.RelatedEntityId,
            RelatedPostId: this.RelatedPostId,
            RelatedEntityTable: this.actionToTable(),
            Action: this.Action,
            TargetUserId: this.TargetUserId,
            Seen: this.Seen || SeenType.Unseen
        }
    }

    toBroadcastNotification(): BroadcastCrudNotification {
        return {
            NotificationId: this.NotificationId,
            RelatedPostId: this.RelatedPostId,
            Action: this.Action
        }
    }

    private actionToTable(): string {
        if (this.Action == PeerToPeerNotificationType.Like || this.Action == PeerToPeerNotificationType.Pray) {
            return 'Reactions'
        } else if (this.Action == PeerToPeerNotificationType.Comment || this.Action == PeerToPeerNotificationType.Reply) {
            return 'Comments'
        } else {
            return 'Posts'
        }
    }
}

export interface PeerToPeerCrudNotification {
    UserId: number,
    TargetUserId: number,
    Seen: SeenType,
    NotificationId?: number,
    RelatedPostId: number,
    RelatedEntityId: number,
    RelatedEntityTable: string,
    Action: string,
    CreationDate?: Date
}

export interface BroadcastCrudNotification {
    NotificationId?: number,
    RelatedPostId: number,
    Action: string,
    CreationDate?: Date
}

interface NotificationCreation {
    Type: NotificationType
    ActionMakerUserId: number
    ActionMakerUsername: string
    RelatedEntityId: number
    RelatedPostId: number
    Action: PeerToPeerNotificationType | BroadcastNotificationType
    Seen?: SeenType
    TargetUserId?: number
}
