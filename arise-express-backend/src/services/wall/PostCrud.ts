import DbPool from '../../db/DatabasePool'
import { findFirst } from '../../db/DbHelper'
import { Post, WallPost, PostType, PostVisibility, Limit } from './Post'
import { CommentVisibility } from '../comment/Comment'
import { config } from '../../config/config'

const SELECT = `SELECT P.PostId, P.CreationDate, P.Description, P.Post, P.PostId, P.Title, P.Type_Mobile AS Type,
                        U.UserId, concat(U.FirstName, ' ', U.LastName) AS Author,
                        M.Url AS ImageUrl,
                        COALESCE(R.ReactionsCounter, 0) AS ReactionsCounter,
                        COALESCE(C.CommentsCounter, 0) AS CommentsCounter
                        FROM Posts as P
                        LEFT JOIN Users AS U ON P.UserId = U.UserId
                        LEFT JOIN Media AS M ON M.MediaId = P.MediaId AND M.Type = 'image'
                        LEFT JOIN (SELECT R.RelatedPostId, COUNT(1) AS ReactionsCounter
                                FROM Reactions R
                                GROUP BY R.RelatedPostId) AS R
                            ON R.RelatedPostId = P.PostId
                        LEFT JOIN (SELECT C.RelatedPostId, COUNT(1) AS CommentsCounter
                                FROM Comments C
                                WHERE C.Visibility = ${CommentVisibility.Visible}
                                GROUP BY C.RelatedPostId) AS C
                        ON C.RelatedPostId = P.PostId`

export default class PostCrud {

    public async findWallPostById(postId: number): Promise<WallPost> {
        const sqlQuery = `${SELECT}
                            WHERE P.PostId = ?
                            AND P.Visibility = ?`
        const filterValues = [postId, PostVisibility.Visible]
        let posts: Array<WallPost> = await DbPool.query(sqlQuery, filterValues)
        posts = this.addUrls(posts)
        return findFirst(posts)
    }

    public async loadContent(limit: Limit): Promise<Array<WallPost>> {
        const sqlQuery = `${SELECT}
                        WHERE P.Visibility = ?
                        AND P.Type_Mobile IN (?)
                        ${limit.LastLoadedPostId > 0 ? 'AND P.PostId < ?' : ''}
                        ORDER BY P.PostId DESC
                        LIMIT ?`
        const filterValues = this.getFilerValues(limit)
        let posts: Array<WallPost> = await DbPool.query(sqlQuery, filterValues)
        posts = this.addUrls(posts)
        return posts
    }

    private addUrls(wallPosts: Array<WallPost>): Array<WallPost> {
        return wallPosts.map(post => {
            if (post.Type == PostType.Video) {
                post.VideoUrl = post.Post
            } else if (post.Type == PostType.Image) {
                post.ImageUrl = post.ImageUrl ? config.server.url + '/' + post.ImageUrl : undefined
            }
            return post
        })
    }

    private getFilerValues(limit: Limit): Array<any> {
        const contentTypes = [PostType.Article, PostType.Event, PostType.Prayer, PostType.Image, PostType.Video]
        const filterValues = [PostVisibility.Visible, contentTypes]
        if (limit.LastLoadedPostId > 0) {
            filterValues.push(limit.LastLoadedPostId)
        }
        filterValues.push(limit.BatchSize)
        return filterValues
    }

    public async findPostById(postId: number): Promise<Post> {
        const posts: Array<Post> = await DbPool.query('SELECT P.PostId, P.UserId, P.Author, P.CreationDate, \
                                                    P.Description, P.Post, P.Title, P.Type_Mobile AS Type \
                                                    FROM Posts as P \
                                                    WHERE P.PostId = ? \
                                                    AND P.Visibility = ?', [postId, PostVisibility.Visible])
        return findFirst(posts)
    }

    public async updatePostsForUser(username: string, userId: number): Promise<number> {
        return DbPool.update('Posts', { Author: username }, { column: 'UserId', value: userId })
    }

}