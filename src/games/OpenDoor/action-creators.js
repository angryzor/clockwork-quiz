import {
	CHOOSE_VIDEO, PLAY_PAUSE, SHOW_ANSWERS, BACK_TO_SELECTION, TOGGLE_ANSWER
} from './actions'

export const playPause = () => ({ type: PLAY_PAUSE, payload: { } })
export const showAnswers = () => ({ type: SHOW_ANSWERS })
export const backToSelection = () => ({ type: BACK_TO_SELECTION, payload: { } })
export const chooseVideo = (video) => ({ type: CHOOSE_VIDEO, payload: { video } })
export const toggleAnswer = (answer, value) => ({ type: TOGGLE_ANSWER, payload: { answer, value } })
