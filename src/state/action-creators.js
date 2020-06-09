import { START_GAME, NEXT_GAME, START_COUNTDOWN, STOP_COUNTDOWN, MODIFY_SCORE, MODIFY_CURRENT_PLAYER_SCORE, SWITCH_PLAYER, INITIALIZE_GAME, PLAYER_ELIMINATED, CORRECT_SOUND, REVEAL_NAMES } from './actions'

export const startGame = () => ({ type: START_GAME, payload: { } })
export const nextGame = () => ({ type: NEXT_GAME, payload: { } })
export const initializeGame = () => ({ type: INITIALIZE_GAME, payload: { } })
export const startCountdown = () => ({ type: START_COUNTDOWN, payload: { } })
export const stopCountdown = () => ({ type: STOP_COUNTDOWN, payload: { } })
export const switchPlayer = (nextPlayer) => ({ type: SWITCH_PLAYER, payload: { nextPlayer } })
export const modifyScore = (player, value) => ({ type: MODIFY_SCORE, payload: { player, value } })
export const modifyCurrentPlayerScore = (value) => ({ type: MODIFY_CURRENT_PLAYER_SCORE, payload: { value } })
export const playerEliminated = (player) => ({ type: PLAYER_ELIMINATED, payload: { player } })
export const correctSound = () => ({ type: CORRECT_SOUND, payload: { } })
export const revealNames = () => ({ type: REVEAL_NAMES, payload: { } })
