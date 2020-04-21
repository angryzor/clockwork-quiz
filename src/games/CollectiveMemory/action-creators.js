import { NEXT_VIDEO, FOUND_ANSWER, PLAY_PAUSE, SHOW_ANSWERS } from './actions'

export const nextVideo = () => ({ type: NEXT_VIDEO, payload: { } })
export const foundAnswer = (answer) => ({ type: FOUND_ANSWER, payload: { answer } })
export const playPause = () => ({ type: PLAY_PAUSE, payload: { } })
export const showAnswers = () => ({ type: SHOW_ANSWERS })
