import { TOGGLE_ANSWER } from './actions'

export const toggleAnswer = (answer, value) => ({ type: TOGGLE_ANSWER, payload: { answer, value } })
