import axios from 'axios'

export default class CommentEndpoints {
  static getComments = async postId => axios.get(`/posts/${postId}/comments`)

  static addComment = async (userId, name, postId, comment) =>
    axios.post(`/posts/${postId}/comments`, {
      userId,
      name,
      comment
    })
}
