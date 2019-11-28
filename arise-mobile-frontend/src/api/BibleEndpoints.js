import axios from 'axios'

export default class BibleEndpoints {

  static loadVersion = async (queryParams = { version }) => {
    await axios.get(`/bible`, { params: queryParams })
  }
  
}