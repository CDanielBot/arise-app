import { ReactionType } from '../reaction/Reaction'

export enum PostType {
    Article = 'article',
    Video = 'video',
    Event = 'event',
    Prayer = 'prayer',
    Image = 'image'
}

export enum PostVisibility {
    NotVisible = 0,
    Visible = 1
}

export interface Post {
    PostId: number
    UserId: number
    Author: string
    CreationDate: Date
    Description: string
    Post: string
    Title: string
    Type: PostType
}

export interface WallPost extends Post {
    ReactionsCounter: number
    CommentsCounter: number
    UserReaction: ReactionType | undefined
    UserReactionId: number
    ImageUrl: string
    VideoUrl: string
}

export interface Limit {
    BatchSize: number
    LastLoadedPostId: number
}