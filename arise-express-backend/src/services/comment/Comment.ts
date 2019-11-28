export enum CommentVisibility {
    NotVisible = 0,
    Visible = 1,
    VisibleForCreatorOnly = 2
}

export interface CreateCommentReq {
    UserId: number
    Name: string
    RelatedPostId?: number
    RelatedCommentId?: number
    Comment: string
}

export default class Comment {
    CommentId: number
    UserId: number
    Name: string
    RelatedPostId: number
    RelatedCommentId: number
    Comment: string
    Visibility: CommentVisibility
    CreationDate: Date

    constructor(config: CreateCommentReq) {
        if (config) {
            this.UserId = config.UserId
            this.RelatedPostId = config.RelatedPostId
            this.RelatedCommentId = config.RelatedCommentId
            this.Comment = config.Comment
            this.Name = config.Name
        }
    }

    toCrudEntity(): CommentCrudEntity {
        return {
            CommentId: this.CommentId,
            UserId: this.UserId,
            Name: this.Name,
            RelatedPostId: this.RelatedPostId,
            RelatedCommentId: this.RelatedCommentId || 0,
            Comment: this.Comment,
            Visibility: this.Visibility,
            RelatedPostTable: this.RelatedCommentId ? 'Comments' : 'Posts'
        }
    }
}

export interface CommentCrudEntity {
    CommentId: number
    UserId: number
    RelatedPostId: number
    RelatedPostTable: string
    RelatedCommentId: number
    Name: string
    Comment: string
    Visibility: CommentVisibility
}

export interface UpdateCommentReq {
    Comment: string
}