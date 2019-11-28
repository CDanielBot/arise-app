import axios from 'axios'

export default class EvangelismRequestEndpoints {
  static getEvangelismRequests = async userId => axios.get(`users/${userId}/evangelismRequests`)

  static createEvangelismRequest = async (userId, applicantDetails) =>
    axios.post(`/users/${userId}/evangelismRequests`, applicantDetails)

  static deleteEvangelismRequest = async (userId, requestId) =>
    axios.delete(`/users/${userId}/evangelismRequests/${requestId}`)
}
