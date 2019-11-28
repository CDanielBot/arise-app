import createReducer from '../utils/createReducer'
import firebase from 'firebase'
import { UserEndpoints } from 'api'
import { AsyncStorage } from 'react-native'
import * as Expo from 'expo'

// Types
const LOGIN_WITH_EMAIL_REQUEST = '[auth] LOGIN_WITH_EMAIL / REQUEST'
const LOGIN_WITH_EMAIL_SUCCESS = '[auth] LOGIN_WITH_EMAIL / SUCCESS'
const LOGIN_WITH_EMAIL_ERROR = '[auth] LOGIN_WITH_EMAIL / ERROR'

const LOGIN_WITH_GMAIL_REQUEST = '[auth] LOGIN_WITH_GMAIL / REQUEST'
const LOGIN_WITH_GMAIL_SUCCESS = '[auth] LOGIN_WITH_GMAIL / SUCCESS'

const LOGIN_WITH_FACEBOOK_REQUEST = '[auth] LOGIN_WITH_FACEBOOK / REQUEST'
const LOGIN_WITH_FACEBOOK_SUCCESS = '[auth] LOGIN_WITH_FACEBOOK / SUCCESS'

const CREATE_ACCOUNT_REQUEST = '[auth] CREATE_ACCOUNT / REQUEST'
const CREATE_ACCOUNT_SUCCESS = '[auth] CREATE_ACCOUNT / SUCCESS'
const CREATE_ACCOUNT_ERROR = '[auth] CREATE_ACCOUNT / ERROR'

const UPDATE_PERSONAL_INFORMATION_REQUEST = '[auth] UPDATE_PERSONAL_INFORMATION / REQUEST'
const UPDATE_PERSONAL_INFORMATION_SUCCESS = '[auth] UPDATE_PERSONAL_INFORMATION / SUCCESS'
const UPDATE_PERSONAL_INFORMATION_ERROR = '[auth] UPDATE_PERSONAL_INFORMATION / ERROR'

const UPDATE_LANGUAGE_REQUEST = '[auth] UPDATE_LANGUAGE_REQUEST / REQUEST'
const UPDATE_LANGUAGE_SUCCESS = '[auth] UPDATE_LANGUAGE_SUCCESS / SUCCESS'
const UPDATE_LANGUAGE_ERROR = '[auth] UPDATE_LANGUAGE_ERROR / ERROR'

const LOGOUT_REQUEST = '[auth] LOGOUT / REQUEST'
const LOGOUT_SUCCESS = '[auth] LOGOUT / SUCCESS'

const INIT_USER_FROM_ASYNC_STORAGE = '[auth] INIT_USER_FROM_ASYNC_STORAGE'

const initialState = {
  user: null,
  accessToken: {
    value: null,
    type: 'Bearer'
  }
}

const updateAuth = (state, action) => ({
  ...state,
  ...action.payload.auth
})

// Reducer
export default createReducer(initialState)({
  [INIT_USER_FROM_ASYNC_STORAGE]: updateAuth,
  [LOGIN_WITH_EMAIL_SUCCESS]: updateAuth,
  [LOGIN_WITH_GMAIL_SUCCESS]: updateAuth,
  [LOGIN_WITH_FACEBOOK_SUCCESS]: updateAuth,
  [UPDATE_PERSONAL_INFORMATION_SUCCESS]: (state, { payload: { profileInformation } }) => ({
    ...state,
    user: {
      ...state.user,
      firstName: profileInformation.firstName,
      lastName: profileInformation.lastName,
      mobile: profileInformation.mobile
    }
  }),
  [UPDATE_LANGUAGE_SUCCESS]: (state, { payload: { language } }) => ({
    ...state,
    user: {
      ...state.user,
      language: language
    }
  }),
  [LOGOUT_SUCCESS]: (state, action) => ({
    ...state,
    ...initialState
  })
})

// Action Creators
export const loginWithEmailAndPassword = credentials => async dispatch => {
  try {
    dispatch(loginWithEmailRequest())
    const response = await UserEndpoints.loginWithEmailAndPassword(credentials)
    const credential = await firebase.auth().signInWithCustomToken(response.data.accessToken.value)

    const { user } = response.data

    const auth = {
      user: { ...user, isSocialAccount: false },
      accessToken: {
        value: await credential.user.getIdToken(),
        type: 'Bearer'
      }
    }

    AsyncStorage.setItem('auth', JSON.stringify(auth))
    dispatch(loginWithEmailSuccess(auth))

    return response
  } catch (error) {
    dispatch(loginWithEmailError(error))
    return Promise.reject(error)
  }
}

export const loginWithGoogle = () => async dispatch => {
  try {
    const { iosGoogleAppId, androidGoogleAppId } = Expo.Constants.manifest.extra.providers

    const result = await Expo.Google.logInAsync({
      iosClientId: iosGoogleAppId,
      androidClientId: androidGoogleAppId
    })

    if (result.type === 'success') {
      const { idToken, accessToken } = result
      const credential = firebase.auth.GoogleAuthProvider.credential(idToken, accessToken)

      dispatch(loginWithGmailRequest())
      const { user } = await firebase.auth().signInAndRetrieveDataWithCredential(credential)

      const firebaseCredential = { email: user.email }
      const response = await UserEndpoints.saveOrUpdateSocialAccountOnServer(firebaseCredential)

      const auth = {
        user: { ...response.data.user, isSocialAccount: true },
        accessToken: {
          value: await user.getIdToken(),
          type: 'Bearer'
        }
      }

      AsyncStorage.setItem('auth', JSON.stringify(auth))
      dispatch(loginWithGmailSuccess(auth))
      return
    }

    return Promise.reject(`User canceled login with Google popup`)
  } catch (error) {
    console.log(error)
  }
}

export const loginWithFacebook = () => async dispatch => {
  try {
    const { facebookAppId } = Expo.Constants.manifest.extra.providers
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(facebookAppId)

    if (type === 'success') {
      const credential = firebase.auth.FacebookAuthProvider.credential(token)

      dispatch(loginWithFacebookRequest())
      const user = await firebase.auth().signInAndRetrieveDataWithCredential(credential)

      const firebaseCredential = { email: user.email }
      const response = await UserEndpoints.saveOrUpdateSocialAccountOnServer(firebaseCredential)

      const auth = {
        user: { ...response.data.user, isSocialAccount: true },
        accessToken: {
          value: await user.getIdToken(),
          type: 'Bearer'
        }
      }

      AsyncStorage.setItem('auth', JSON.stringify(auth))
      dispatch(loginWithFacebookSuccess(auth))
      return
    }

    return Promise.reject(`User canceled login with Facebook popup`)
  } catch (error) {
    console.log(error)
  }
}

export const initUserFromAsyncStorage = auth => dispatch => {
  dispatch({
    type: INIT_USER_FROM_ASYNC_STORAGE,
    payload: { auth }
  })
}

export const createAccount = accountInformation => async dispatch => {
  try {
    dispatch(createAccountRequest())
    const response = await UserEndpoints.createAccount(accountInformation)
    dispatch(createAccountSuccess(response.data))
  } catch (error) {
    dispatch(createAccountError(error))
    return Promise.reject(error)
  }
}

export const updatePersonalInformation = (id, profileInformation) => async dispatch => {
  try {
    dispatch(updatePersonalInformationRequest())
    await UserEndpoints.updateAccount(id, profileInformation)
    dispatch(updatePersonalInformationSuccess(profileInformation))
  } catch (error) {
    dispatch(updatePersonalInformationError(error))
    return Promise.reject(error)
  }
}

export const updateLanguage = (id, language) => async dispatch => {
  try {
    dispatch(updateLanguageRequest())
    await UserEndpoints.updateAccount(id, language)
    dispatch(updateLanguageSuccess(language))
  } catch (error) {
    dispatch(updateLanguageError(error))
    return Promise.reject(error)
  }
}

export const logout = () => async dispatch => {
  try {
    dispatch(logoutRequest())

    await firebase.auth().signOut()
    AsyncStorage.removeItem('auth')

    dispatch(logoutSuccess())
  } catch (error) {
    console.log(error)
  }
}

// Actions
const loginWithEmailRequest = () => ({ type: LOGIN_WITH_EMAIL_REQUEST })
const loginWithEmailSuccess = auth => ({ type: LOGIN_WITH_EMAIL_SUCCESS, payload: { auth } })
const loginWithEmailError = error => ({ type: LOGIN_WITH_EMAIL_ERROR, payload: { error } })

const loginWithGmailRequest = () => ({ type: LOGIN_WITH_GMAIL_REQUEST })
const loginWithGmailSuccess = auth => ({ type: LOGIN_WITH_GMAIL_SUCCESS, payload: { auth } })

const loginWithFacebookRequest = () => ({ type: LOGIN_WITH_FACEBOOK_REQUEST })
const loginWithFacebookSuccess = auth => ({ type: LOGIN_WITH_FACEBOOK_SUCCESS, payload: { auth } })

const createAccountRequest = () => ({ type: CREATE_ACCOUNT_REQUEST })
const createAccountSuccess = () => ({ type: CREATE_ACCOUNT_SUCCESS })
const createAccountError = error => ({ type: CREATE_ACCOUNT_ERROR, error })

const updatePersonalInformationRequest = () => ({ type: UPDATE_PERSONAL_INFORMATION_REQUEST })
const updatePersonalInformationSuccess = profileInformation => ({
  type: UPDATE_PERSONAL_INFORMATION_SUCCESS,
  payload: { profileInformation }
})
const updatePersonalInformationError = error => ({ type: UPDATE_PERSONAL_INFORMATION_ERROR, error })

const updateLanguageRequest = () => ({ type: UPDATE_LANGUAGE_REQUEST })
const updateLanguageSuccess = language => ({
  type: UPDATE_LANGUAGE_SUCCESS,
  payload: language
})
const updateLanguageError = error => ({ type: UPDATE_LANGUAGE_ERROR, error })

const logoutRequest = () => ({ type: LOGOUT_REQUEST })
const logoutSuccess = () => ({ type: LOGOUT_SUCCESS })
