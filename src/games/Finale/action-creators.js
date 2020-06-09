import {
	FOUND_ANSWER, START, STOP, TO_POSTROUND, NEXT_ROUND
} from './actions'

export const foundAnswer = (answer) => ({ type: FOUND_ANSWER, payload: { answer } })
export const start = () => ({ type: START, payload: { } })
export const stop = () => ({ type: STOP, payload: { } })
export const toPostRound = () => ({ type: TO_POSTROUND, payload: { } })
export const nextRound = () => ({ type: NEXT_ROUND, payload: { } })
