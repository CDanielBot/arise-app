import { string, number, shape, oneOf, bool } from 'prop-types'

export const PostVariant = oneOf(['article', 'media', 'event', 'post', 'image'])

export const PostType = shape({
  postId: number.isRequired,
  title: string.isRequired,
  userId: number.isRequired,
  type: PostVariant.isRequired,
  post: string.isRequired,
  showPostOptions: bool
})
