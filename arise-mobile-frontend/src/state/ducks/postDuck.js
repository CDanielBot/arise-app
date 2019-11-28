import createReducer from '../utils/createReducer'
import { PostEndpoints } from 'api'

// Types
const SET_STARTING_TIMESTAMP = '[posts] SET_STARTING_TIMESTAMP'

const GET_POSTS_REQUEST = '[posts] GET_POSTS / REQUEST'
const GET_POSTS_SUCCESS = '[posts] GET_POSTS / SUCCESS'
const GET_POSTS_ERROR = '[posts] GET_POSTS / ERROR'

const LOAD_MORE_POSTS_REQUEST = '[posts] LOAD_MORE_POSTS / REQUEST'
const LOAD_MORE_POSTS_SUCCESS = '[posts] LOAD_MORE_POSTS / SUCCESS'
const LOAD_MORE_POSTS_ERROR = '[posts] LOAD_MORE_POSTS / ERROR'

const INCREMENT_POST_COMMENTS_COUNTER = '[posts] INCREMENT_POST_COMMENTS_COUNTER'

// initial State
const BATCH_SIZE_CONSTANT = 10

const initialState = {
  items: [],
  batchSize: BATCH_SIZE_CONSTANT,
  lastLoadedPostId: null
}

// Reducer
export default createReducer(initialState)({
  [SET_STARTING_TIMESTAMP]: (state, { payload: { startingTimestamp } }) => ({
    ...state,
    startingTimestamp
  }),

  [GET_POSTS_SUCCESS]: (state, { payload: { posts } }) => ({
    ...state,
    items: posts,
    lastLoadedPostId: posts.slice(-1).pop().postId
  }),

  [LOAD_MORE_POSTS_SUCCESS]: (state, { payload: { posts } }) => ({
    ...state,
    items: [...state.items, ...posts],
    lastLoadedPostId: posts.slice(-1).pop().postId
  }),

  [INCREMENT_POST_COMMENTS_COUNTER]: (state, { payload: { postId } }) => ({
    ...state,
    items: state.items.map(post =>
      post.postId === postId ? { ...post, commentsCounter: post.commentsCounter + 1 } : post
    )
  })
})

// Action Creators
export const getPosts = userId => async dispatch => {
  try {
    dispatch(getPostsRequest())
    const response = await PostEndpoints.getPosts({
      userId,
      batchSize: BATCH_SIZE_CONSTANT
    })
    dispatch(getPostsSuccess(response.data.posts))
  } catch (error) {
    dispatch(getPostsError())
    console.log(error)
    return Promise.reject(error)
  }
}

export const loadMorePosts = ({ userId, batchSize, lastLoadedPostId }) => async dispatch => {
  try {
    dispatch(loadMorePostsRequest())
    const response = await PostEndpoints.loadMorePosts({ userId, batchSize, lastLoadedPostId })
    dispatch(loadMorePostsSuccess(response.data.posts))
  } catch (error) {
    dispatch(loadMorePostsError())
    console.log(error)
    return Promise.reject(error)
  }
}

// Actions
const getPostsRequest = () => ({ type: GET_POSTS_REQUEST })
const getPostsSuccess = posts => ({ type: GET_POSTS_SUCCESS, payload: { posts } })
const getPostsError = () => ({ type: GET_POSTS_ERROR })

const loadMorePostsRequest = () => ({ type: LOAD_MORE_POSTS_REQUEST })
const loadMorePostsSuccess = posts => ({ type: LOAD_MORE_POSTS_SUCCESS, payload: { posts } })
const loadMorePostsError = () => ({ type: LOAD_MORE_POSTS_ERROR })

export const incrementPostCommentsCounter = postId => ({
  type: INCREMENT_POST_COMMENTS_COUNTER,
  payload: { postId }
})
