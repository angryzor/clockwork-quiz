import {
	CHOOSE_VIDEO, PLAY_PAUSE, SHOW_ANSWERS, BACK_TO_SELECTION, FOUND_ANSWER, START, STOP, TO_POSTROUND
} from './actions'

export const playPause = () => ({ type: PLAY_PAUSE, payload: { } })
export const showAnswers = () => ({ type: SHOW_ANSWERS })
export const backToSelection = () => ({ type: BACK_TO_SELECTION, payload: { } })
export const chooseVideo = (video) => ({ type: CHOOSE_VIDEO, payload: { video } })
export const foundAnswer = (answer) => ({ type: FOUND_ANSWER, payload: { answer } })
export const start = () => ({ type: START, payload: { } })
export const stop = () => ({ type: STOP, payload: { } })
export const toPostRound = () => ({ type: TO_POSTROUND, payload: { } })
