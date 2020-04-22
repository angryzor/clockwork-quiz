import { NEXT_ROUND, FOUND_ANSWER, PLAY_PAUSE, SHOW_ANSWERS, START, TO_POSTROUND, STOP } from './actions'

export const nextRound = () => ({ type: NEXT_ROUND, payload: { } })
export const foundAnswer = (answer) => ({ type: FOUND_ANSWER, payload: { answer } })
export const playPause = () => ({ type: PLAY_PAUSE, payload: { } })
export const showAnswers = () => ({ type: SHOW_ANSWERS })
export const start = () => ({ type: START, payload: { } })
export const stop = () => ({ type: STOP, payload: { } })
export const toPostRound = () => ({ type: TO_POSTROUND, payload: { } })
