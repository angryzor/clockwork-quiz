import { FOUND_ANSWER, START, NEXT_ROUND, STOP } from './actions'

export const foundAnswer = (answer) => ({ type: FOUND_ANSWER, payload: { answer } })
export const start = () => ({ type: START, payload: { } })
export const stop = () => ({ type: STOP, payload: { } })
export const nextRound = () => ({ type: NEXT_ROUND, payload: { } })
