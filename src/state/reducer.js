import {
	NEXT_GAME, START_GAME, STOP_COUNTDOWN, MODIFY_SCORE, SWITCH_PLAYER,
} from './actions'
import { getCurrentGameReducer } from './selectors'
import config from '../config'
import { over, lensIndex, add } from 'ramda'

const initialState = {
	currentGame: 0,
	gameState: undefined,
	playState: 'DESCRIPTION',
	currentPlayer: 0,
	scores: config.teams.map(() => 60),
}

export default (state = initialState, { type, payload }) => {
	switch (type) {
		case NEXT_GAME:
			return { ...state, currentGame: state.currentGame + 1, gameState: undefined, playState: 'DESCRIPTION' }
		case START_GAME:
			return { ...state, playState: 'PLAYING', gameState: getCurrentGameReducer()(state)(undefined, { type, payload }, { currentPlayer: state.currentPlayer, scores: state.scores }) }
		case STOP_COUNTDOWN:
			return { ...state, currentPlayer: payload.nextPlayer }
		case SWITCH_PLAYER:
			return { ...state, currentPlayer: payload.nextPlayer }
		case MODIFY_SCORE:
			return { ...state, scores: over(lensIndex(state.currentPlayer), add(payload.value), state.scores) }
		default:
			return { ...state, gameState: getCurrentGameReducer()(state)(state.gameState, { type, payload }, { currentPlayer: state.currentPlayer, scores: state.scores }) }
	}
}
