import axios from 'axios'

export default class PrayerEndpoints {
  static createPrayer = async (userId, prayerText) =>
    axios.post(`/users/${userId}/prayerRequests`, { post: prayerText })
}
