import { START_GAME, NEXT_GAME, START_COUNTDOWN, STOP_COUNTDOWN, MODIFY_SCORE, SWITCH_PLAYER, INITIALIZE_GAME } from './actions'

export const startGame = () => ({ type: START_GAME, payload: { } })
export const nextGame = () => ({ type: NEXT_GAME, payload: { } })
export const initializeGame = () => ({ type: INITIALIZE_GAME, payload: { } })
export const startCountdown = () => ({ type: START_COUNTDOWN, payload: { } })
export const stopCountdown = () => ({ type: STOP_COUNTDOWN, payload: { } })
export const switchPlayer = (nextPlayer) => ({ type: SWITCH_PLAYER, payload: { nextPlayer } })
export const modifyScore = (value) => ({ type: MODIFY_SCORE, payload: { value } })