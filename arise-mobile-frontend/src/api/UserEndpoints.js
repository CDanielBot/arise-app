import axios from 'axios'

export default class UserEndpoints {
  static loginWithEmailAndPassword = credentials => axios.post(`/users/login`, credentials)

  static createAccount = async accountInformation => await axios.post(`/users`, accountInformation)

  static saveOrUpdateSocialAccountOnServer = firebaseCredential =>
    axios.post(`/users/register`, firebaseCredential)

  static updateAccount = (id, data) => axios.put(`/users/${id}`, data)
}
