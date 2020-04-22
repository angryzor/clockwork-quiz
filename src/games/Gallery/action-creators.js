import {
	PREVIOUS_PICTURE,
	NEXT_PICTURE,
	NEXT_ROUND,
	START,
	STOP,
	COMPLETION_START,
	COMPLETION_STOP,
	TO_POSTROUND,
	CORRECT_ANSWER,
	FOUND_ANSWER,
	TO_COMPLETION,
} from './actions'

export const previousPicture = () => ({ type: PREVIOUS_PICTURE, payload: { } })
export const nextPicture = () => ({ type: NEXT_PICTURE, payload: { } })
export const nextRound = () => ({ type: NEXT_ROUND, payload: { } })
export const start = () => ({ type: START, payload: { } })
export const stop = () => ({ type: STOP, payload: { } })
export const completionStart = () => ({ type: COMPLETION_START, payload: { } })
export const completionStop = () => ({ type: COMPLETION_STOP, payload: { } })
export const correctAnswer = () => ({ type: CORRECT_ANSWER, payload: { } })
export const foundAnswer = (answer) => ({ type: FOUND_ANSWER, payload: { answer } })
export const toPostRound = () => ({ type: TO_POSTROUND, payload: { } })
export const toCompletion = () => ({ type: TO_COMPLETION, payload: { } })
