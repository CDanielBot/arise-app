export enum ReactionType {
    pray = 'pray',
    like = 'like'
}

export interface CreateReactionReq {
    UserId: number
    RelatedPostId: number
    UserFullName: string
    ReactionType: ReactionType
}

// each key is a PostId, that maps to all the reactions that post has
export interface PostReactions {
    [key: number]: Array<ReactionCrudEntity>
}

export default class Reaction {
    ReactionId: number
    UserId: number
    RelatedPostId: number
    UserFullName: string
    ReactionType: ReactionType
    CreationDate?: Date

    constructor(config: any) {
        if (config) {
            this.ReactionId = config.ReactionId
            this.UserId = config.UserId
            this.RelatedPostId = config.RelatedPostId
            this.UserFullName = config.UserFullName || config.Name
            this.ReactionType = config.ReactionType || config.Reaction
            this.CreationDate = config.CreationDate
        }
    }

    toCrudEntity(): ReactionCrudEntity {
        return {
            ReactionId: this.ReactionId,
            UserId: this.UserId,
            RelatedPostId: this.RelatedPostId,
            RelatedPostTable: 'Posts',
            Name: this.UserFullName,
            Reaction: this.ReactionType
        }
    }
}

export interface ReactionCrudEntity {
    ReactionId: number
    UserId: number
    RelatedPostId: number
    RelatedPostTable: string
    Name: string
    Reaction: ReactionType
}