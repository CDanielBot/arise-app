import { PostType } from '../wall/Post'

export interface UserPrayerReq {
  Title: string
  Description: string
  Post: string
  UserId?: number
}

export default class Prayer {
  Id?: number
  Title: string
  Description: string
  Post: string
  UserId?: number
  Author: string
  CreationDate?: Date
  UserReactionId?: string
  ReactionsCounter: number
  CommentsCounter: number
  UserReaction?: string

  constructor(config: UserPrayerReq) {
    if (config) {
      this.UserId = config.UserId
      this.Title = config.Title
      this.Description = config.Description
      this.Post = config.Post
    }
    this.ReactionsCounter = 0
    this.CommentsCounter = 0
  }

  toCrudEntity(): PrayerCrudEntity {
    return {
      Title: this.Title || '',
      Title_en: this.Title || '',
      Description: this.Description || '',
      Description_en: this.Description || '',
      Post: this.Post,
      Post_en: this.Post,
      UserId: this.UserId,
      CategoryId: 14, // Category Diverse (select * from Categories where type='post')
      GroupId: 1, // Group Comunitatea Arise (select * from `Groups`)
      Type: 'post',
      Type_mobile: PostType.Prayer
    }
  }
}

export interface PrayerCrudEntity {
  Id?: number
  Title: string
  Title_en: string
  Description: string
  Description_en: string
  Post: string
  Post_en: string
  Type: string // Please remove this after Type column is eradicated from Posts table
  Type_mobile: string
  CategoryId: number
  GroupId: number
  UserId: number
  CreationDate?: Date
}
