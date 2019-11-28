import axios from 'axios'
import { Service } from 'axios-middleware'
import store from '../state/store'

const base_url = 'http://192.168.43.66:3001/api/v1'

export default () => {
  applyErrorHandler()
  applyRequestBodyCaseConversion()
  applyAccessTokenOnRequests()
  applyBaseUrl()
}

applyBaseUrl = () => {
  axios.defaults.baseURL = base_url
  // axios.get(`/ping`).then( () => {
    // console.log('yeah boy!! ')
  // })
}

applyAccessTokenOnRequests = () => {
  axios.interceptors.request.use(
    config => {
      if (config.baseURL === base_url && !config.headers.Authorization) {
        const token = store.getState().auth.accessToken.value

        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }
 
      return config
    },
    error => Promise.reject(error)
  )
}

applyErrorHandler = () => {
  axios.interceptors.response.use(
    response => response.data,
    error => {
      console.log('Error: ' + JSON.stringify(error))
      return Promise.reject(error.response.data.error)
    }
  )
}

applyRequestBodyCaseConversion = () => {
  const service = new Service(axios)

  service.register({
    onRequest(config) {
      if (config && config.data && JSON.parse(config.data)) {
        const pascalCase = toPascalCase(JSON.parse(config.data))
        config.data = JSON.stringify(pascalCase)
      }

      return config
    },
    onResponse(response) {
      if (response && response.data && JSON.parse(response.data)) {
        const camelCase = toCamelCase(JSON.parse(response.data))
        response.data = JSON.stringify(camelCase)
      }

      return response
    }
  })
}

toPascalCase = o => {
  var newO, origKey, newKey, value
  if (o instanceof Array) {
    return o.map(function(value) {
      if (typeof value === 'object') {
        value = toPascalCase(value)
      }
      return value
    })
  } else {
    newO = {}
    for (origKey in o) {
      if (o.hasOwnProperty(origKey)) {
        newKey = (origKey.charAt(0).toUpperCase() + origKey.slice(1) || origKey).toString()
        value = o[origKey]
        if (value instanceof Array || (value !== null && value.constructor === Object)) {
          value = toPascalCase(value)
        }
        newO[newKey] = value
      }
    }
  }
  return newO
}

toCamelCase = o => {
  var newO, origKey, newKey, value
  if (o instanceof Array) {
    return o.map(function(value) {
      if (typeof value === 'object') {
        value = toCamelCase(value)
      }
      return value
    })
  } else {
    newO = {}
    for (origKey in o) {
      if (o.hasOwnProperty(origKey)) {
        newKey = (origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey).toString()
        value = o[origKey]
        if (value instanceof Array || (value !== null && value.constructor === Object)) {
          value = toCamelCase(value)
        }
        newO[newKey] = value
      }
    }
  }
  return newO
}
