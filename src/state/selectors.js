import config from '../config'
import { getGame } from '../games'

export const getPlayState = () => state => state.playState
export const getCurrentGame = () => state => getGame(config.games[state.currentGame].type)
export const getCurrentGameConfig = () => state => config.games[state.currentGame].config
export const getCurrentGameState = () => state => state.gameState
export const getCurrentGameReducer = () => state => getCurrentGame()(state).reducer(getCurrentGameConfig()(state))
