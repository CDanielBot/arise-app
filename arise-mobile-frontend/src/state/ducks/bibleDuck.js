import createReducer from '../utils/createReducer'
import Versions from '../../components/app/bible/Versions'
import Books from '../../components/app/bible/Books'
import { BibleEndpoints } from 'api'
import * as bibleStorage from './BibleStorage'

// Types
const LOAD_VERSION_REQUEST = '[bible] LOAD_VERSION / REQUEST'
const LOAD_VERSION_SUCCESS = '[bible] LOAD_VERSION / SUCCESS'
const LOAD_VERSION_ERROR = '[bible] LOAD_VERSION / ERROR'

const FETCH_VERSES_REQUEST = '[bible] FETCH_VERSES / REQUEST'
const FETCH_VERSES_SUCCESS = '[bible] FETCH_VERSES / SUCCESS'
const FETCH_VERSES_ERROR = '[bible] FETCH_VERSES / ERROR'

const SET_ACTIVE_CHAPTER = '[bible] SET_ACTIVE_CHAPTER'
const SET_ACTIVE_BOOK = '[bible] SET_ACTIVE_BOOK'
const SET_ACTIVE_VERSION = '[bible] SET_ACTIVE_VERSION'
const SET_JUMP_TEXT = '[bible] SET_JUMP_TEXT'
const JUMP_TO_VERSE = '[bible] JUMP_TO_VERSE'
const GO_TO_PREVIOUS_CHAPTER = '[bible] GO_TO_PREVIOUS_CHAPTER'
const GO_TO_NEXT_CHAPTER = '[bible] GO_TO_NEXT_CHAPTER'

const initialState = {
    activeVersion: Versions[1],
    activeBook: Books[0],
    activeChapter: 1,
    activeVerse: null,
    jumpText: '',
    verses: [],
}

// Reducer
export default createReducer(initialState)({
    [LOAD_VERSION_SUCCESS]: (state, { payload: { activeVersion } }) => ({
        ...state,
        activeVersion
    }),
    [FETCH_VERSES_SUCCESS]: (state, { payload: { verses } }) => ({
        ...state,
        verses
    }),
    [SET_ACTIVE_VERSION]: (state, { payload: { version } }) => ({
        ...state,
        activeVersion: version
    }),
    [SET_ACTIVE_CHAPTER]: (state, { payload: { chapter } }) => ({
        ...state,
        activeChapter: chapter
    }),
    [SET_ACTIVE_BOOK]: (state, { payload: { book } }) => ({
        ...state,
        activeBook: book
    }),
    [JUMP_TO_VERSE]: (state, { payload: { activeBook, activeChapter, activeVerse } }) => ({
        ...state,
        activeBook,
        activeChapter,
        activeVerse
    }),
    [SET_JUMP_TEXT]: (state, { payload: { jumpText } }) => ({
        ...state,
        jumpText: jumpText
    }),
    [GO_TO_PREVIOUS_CHAPTER]: (state, { payload: { previousChapter } }) => ({
        ...state,
        activeChapter: previousChapter
    }),
    [GO_TO_NEXT_CHAPTER]: (state, { payload: { nextChapter } }) => ({
        ...state,
        activeChapter: nextChapter
    }),
})

// Action Creators
export const loadVersion = versionToLoad => async dispatch => {

    try {
        dispatch(loadVersionRequest())
        const isLoaded = await bibleStorage.isVersionLoaded(versionToLoad.value)
        if (!isLoaded) {
            const bibleVerses = await BibleEndpoints.loadVersion(versionToLoad.value)
            await bibleStorage.loadVerses(versionToLoad.value, bibleVerses)
        }
        dispatch(loadVersionSuccess(versionToLoad))
    } catch (error) {
        dispatch(loadVersionError())
        return Promise.reject(error)
    }
}

export const fetchVerses = (bible) => async dispatch => {
    try {
        const { activeBook, activeChapter, activeVersion } = bible
        dispatch(fetchVersesRequest())
        const bookVerses = await bibleStorage.getBookVerses(activeVersion.value, activeBook.value, activeChapter.value)
        const verses = bookVerses.map(verse => { verse.type, verse.content })
        dispatch(fetchVersesSuccess(verses))
    } catch (error) {
        dispatch(fetchVersesError())
        return Promise.reject(error)
    }
}

export const setActiveChapter = (chapter) => dispatch => {
    dispatch({ type: SET_ACTIVE_CHAPTER, payload: { chapter } })
}

export const setActiveBook = (book) => dispatch => {
    dispatch({ type: SET_ACTIVE_BOOK, payload: { book } })
}

export const setActiveVersion = (version) => dispatch => {
    dispatch({ type: SET_ACTIVE_VERSION, payload: { version } })
}

export const jumpToVerse = (payload) => dispatch => {
    dispatch({ type: JUMP_TO_VERSE, payload: payload })
}

export const setJumpText = (jumpText) => dispatch => {
    dispatch({ type: SET_JUMP_TEXT, payload: { jumpText } })
}

export const goToNextChapter = (activeChapter) => dispatch => {
    let nextChapter = activeChapter + 1
    const currentBook = Books.filter(book => book.value == state.activeBook.value)[0]
    nextChapter = nextChapter > currentBook.total ? currentBook.total : nextChapter
    dispatch({ type: GO_TO_NEXT_CHAPTER, payload: { nextChapter } })
}

export const goToPreviousChapter = (activeChapter) => dispatch => {
    let previousChapter = activeChapter - 1
    previousChapter = previousChapter < 1 ? 1 : previousChapter
    dispatch({ type: GO_TO_PREVIOUS_CHAPTER, payload: { previousChapter } })
}


// Actions
fetchVersesRequest = () => ({ type: FETCH_VERSES_REQUEST })
fetchVersesSuccess = verses => ({ type: FETCH_VERSES_SUCCESS, payload: { verses } })
fetchVersesError = () => ({ type: FETCH_VERSES_ERROR })

loadVersionRequest = () => ({ type: LOAD_VERSION_REQUEST })
loadVersionSuccess = activeVersion => ({ type: LOAD_VERSION_SUCCESS, payload: { activeVersion } })
loadVersionError = () => ({ type: LOAD_VERSION_ERROR })


