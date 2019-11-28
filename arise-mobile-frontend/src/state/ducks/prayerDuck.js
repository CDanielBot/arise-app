import createReducer from '../utils/createReducer'
import { PrayerEndpoints } from 'api'

// Types
const CREATE_PRAYER_REQUEST = '[prayers] CREATE_PRAYER_REQUEST'
const CREATE_PRAYER_SUCCESS = '[prayers] CREATE_PRAYER_SUCCESS'
const CREATE_PRAYER_ERROR = '[prayers] CREATE_PRAYER_ERROR'

// initial State
const initialState = {}

// Reducer
export default createReducer(initialState)({})

// Thunks
export const createPrayer = (userId, prayerText) => async dispatch => {
  try {
    dispatch(createPrayerRequest())
    await PrayerEndpoints.createPrayer(userId, prayerText)
    dispatch(createPrayerSuccess())
  } catch (error) {
    dispatch(createPrayerError())
    return Promise.reject(error)
  }
}

// Actions
const createPrayerRequest = () => ({ type: CREATE_PRAYER_REQUEST })
const createPrayerSuccess = () => ({ type: CREATE_PRAYER_SUCCESS })
const createPrayerError = () => ({ type: CREATE_PRAYER_ERROR })
