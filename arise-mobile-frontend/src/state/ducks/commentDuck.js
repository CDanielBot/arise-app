import createReducer from '../utils/createReducer'
import { CommentEndpoints } from 'api'

import { incrementPostCommentsCounter } from './postDuck'

// Types
const CLEAR_COMMENTS = '[comments] CLEAR_COMMENTS'

const GET_COMMENTS_REQUEST = '[comments] GET_COMMENTS / REQUEST'
const GET_COMMENTS_SUCCESS = '[comments] GET_COMMENTS / SUCCESS'
const GET_COMMENTS_ERROR = '[comments] GET_COMMENTS / ERROR'

const ADD_COMMENT_REQUEST = '[comments] ADD_COMMENT / REQUEST'
const ADD_COMMENT_SUCCESS = '[comments] ADD_COMMENT / SUCCESS'
const ADD_COMMENT_ERROR = '[comments] ADD_COMMENT / ERROR'

const initialState = {
  items: []
}

// Reducer
export default createReducer(initialState)({
  [CLEAR_COMMENTS]: (state, action) => ({
    ...state,
    items: []
  }),

  [GET_COMMENTS_SUCCESS]: (state, { payload: { comments } }) => {
    if (comments.length === 0) return state

    return {
      ...state,
      items: comments
    }
  },

  [ADD_COMMENT_SUCCESS]: (state, { payload: { comment } }) => ({
    ...state,
    items: [...state.items, comment]
  })
})

// Action Creators
export const clearComments = () => dispatch => dispatch(clearCommentsAction())

export const getComments = postId => async dispatch => {
  try {
    dispatch(getCommentsRequest())
    const response = await CommentEndpoints.getComments(postId)
    dispatch(getCommentsSuccess(response.data.comments))
  } catch (error) {
    dispatch(getCommentsError())
    return Promise.reject(error)
  }
}

export const addComment = (userId, name, postId, comment) => async dispatch => {
  try {
    dispatch(addCommentRequest())
    await CommentEndpoints.addComment(userId, name, postId, comment)
    dispatch(addCommentSuccess({ userId, name, comment }))
    dispatch(incrementPostCommentsCounter(postId))
  } catch (error) {
    dispatch(addCommentError())
    return Promise.reject(error)
  }
}

// Actions
clearCommentsAction = () => ({ type: CLEAR_COMMENTS })

getCommentsRequest = () => ({ type: GET_COMMENTS_REQUEST })
getCommentsSuccess = comments => ({ type: GET_COMMENTS_SUCCESS, payload: { comments } })
getCommentsError = () => ({ type: GET_COMMENTS_ERROR })

addCommentRequest = () => ({ type: ADD_COMMENT_REQUEST })
addCommentSuccess = comment => ({ type: ADD_COMMENT_SUCCESS, payload: { comment } })
addCommentError = () => ({ type: ADD_COMMENT_ERROR })
