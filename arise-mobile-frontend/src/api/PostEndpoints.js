import axios from 'axios'

export default class UserEndpoints {
  static loginWithEmailAndPassword = async credentials =>
    await axios.post(`/users/login`, credentials)

  static createAccount = async data => await axios.post(`/users`, data)

  static saveOrUpdateSocialAccountOnServer = async firebaseCredential =>
    await axios.post(`/users/register`, firebaseCredential)

  static getPosts = async (queryParams = { userId, batchSize }) =>
    await axios.get('/posts', { params: queryParams })

  static loadMorePosts = async (queryParams = { userId, batchSize, lastLoadedPostId }) =>
    await axios.get('/posts', { params: queryParams })
}
