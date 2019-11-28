import createReducer from '../utils/createReducer'
import { EvangelismRequestEndpoints } from 'api'

// Types
const GET_EVANGELISM_REQUESTS = '[evangelismRequest] GET EVANGELISM_REQUESTS'
const GET_EVANGELISM_REQUESTS_SUCCESS = '[evangelismRequest] GET EVANGELISM_REQUESTS_SUCCESS'
const GET_EVANGELISM_REQUESTS_ERROR = '[evangelismRequest] GET EVANGELISM_REQUESTS_ERROR'

const CREATE_EVANGELISM_REQUEST = '[evangelismRequest] CREATE_EVANGELISM_REQUEST / REQUEST'
const CREATE_EVANGELISM_REQUEST_SUCCESS = '[evangelismRequest] CREATE_EVANGELISM_REQUEST / SUCCESS'
const CREATE_EVANGELISM_REQUEST_ERROR = '[evangelismRequest] CREATE_EVANGELISM_REQUEST / ERROR'

const DELETE_EVANGELISM_REQUEST = '[evangelismRequest] DELETE_EVANGELISM_REQUEST'
const DELETE_EVANGELISM_REQUEST_SUCCESS = '[evangelismRequest] DELETE_EVANGELISM_REQUEST_SUCCESS'
const DELETE_EVANGELISM_REQUEST_ERROR = '[evangelismRequest] DELETE_EVANGELISM_REQUEST_ERROR'

const initialState = {
  items: [],
  count: 0
}

// Reducer
export default createReducer(initialState)({
  [GET_EVANGELISM_REQUESTS_SUCCESS]: (state, { payload: { evangelismRequests } }) => ({
    ...state,
    items: evangelismRequests,
    count: evangelismRequests.length
  }),

  [DELETE_EVANGELISM_REQUEST_SUCCESS]: (state, { payload: { requestId } }) => ({
    ...state,
    items: state.items.filter(request => request.id !== requestId),
    count: state.count - 1
  })
})

// Action Creators
export const getEvangelismRequests = userId => async dispatch => {
  try {
    dispatch(getEvangelismRequestsRequest())
    const response = await EvangelismRequestEndpoints.getEvangelismRequests(userId)
    dispatch(getEvangelismRequestsSuccess(response.data.evangelismRequests))
  } catch (error) {
    dispatch(getEvangelismRequestsError())
    return Promise.reject(error)
  }
}

export const createEvangelismRequest = (userId, applicantDetails) => async dispatch => {
  try {
    dispatch(createEvangelismRequestRequest())
    await EvangelismRequestEndpoints.createEvangelismRequest(userId, applicantDetails)
    dispatch(createEvangelismRequestSuccess())
  } catch (error) {
    dispatch(createEvangelismRequestError())
    return Promise.reject(error)
  }
}

export const deleteEvangelismRequest = (userId, requestId) => async dispatch => {
  try {
    dispatch(deleteEvangelismRequestRequest())
    await EvangelismRequestEndpoints.deleteEvangelismRequest(userId, requestId)
    dispatch(deleteEvangelismRequestSuccess(requestId))
  } catch (error) {
    dispatch(deleteEvangelismRequestError())
    return Promise.reject(error)
  }
}

// Actions
const getEvangelismRequestsRequest = () => ({ type: GET_EVANGELISM_REQUESTS })
const getEvangelismRequestsSuccess = evangelismRequests => ({
  type: GET_EVANGELISM_REQUESTS_SUCCESS,
  payload: { evangelismRequests }
})
const getEvangelismRequestsError = () => ({ type: GET_EVANGELISM_REQUESTS_ERROR })

const createEvangelismRequestRequest = () => ({ type: CREATE_EVANGELISM_REQUEST })
const createEvangelismRequestSuccess = () => ({
  type: CREATE_EVANGELISM_REQUEST_SUCCESS
})
const createEvangelismRequestError = () => ({ type: CREATE_EVANGELISM_REQUEST_ERROR })

const deleteEvangelismRequestRequest = () => ({ type: DELETE_EVANGELISM_REQUEST })
const deleteEvangelismRequestSuccess = requestId => ({
  type: DELETE_EVANGELISM_REQUEST_SUCCESS,
  payload: { requestId }
})
const deleteEvangelismRequestError = () => ({ type: DELETE_EVANGELISM_REQUEST_ERROR })
