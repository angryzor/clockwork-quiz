import { PREVIOUS_QUESTION, NEXT_QUESTION, CORRECT_ANSWER, INCORRECT_ANSWER } from './actions'

export const previousQuestion = () => ({ type: PREVIOUS_QUESTION, payload: { } })
export const nextQuestion = () => ({ type: NEXT_QUESTION, payload: { } })
export const correctAnswer = () => ({ type: CORRECT_ANSWER, payload: { } })
export const incorrectAnswer = () => ({ type: INCORRECT_ANSWER, payload: { } })
