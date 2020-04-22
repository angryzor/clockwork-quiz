import {
	NEXT_GAME, START_GAME, MODIFY_SCORE, SWITCH_PLAYER, START_COUNTDOWN, STOP_COUNTDOWN,
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
	countingDown: false,
}

export default (state = initialState, { type, payload }) => {
	switch (type) {
		case NEXT_GAME:
			return { ...state, currentGame: state.currentGame + 1, gameState: undefined, playState: 'DESCRIPTION' }
		case START_GAME:
			return { ...state, playState: 'PLAYING', gameState: getCurrentGameReducer()(state)(undefined, { type, payload }, { currentPlayer: state.currentPlayer, scores: state.scores }) }
		case SWITCH_PLAYER:
			return { ...state, currentPlayer: payload.nextPlayer }
		case MODIFY_SCORE:
			return { ...state, scores: over(lensIndex(state.currentPlayer), add(payload.value), state.scores) }
		case START_COUNTDOWN:
			return { ...state, countingDown: true }
		case STOP_COUNTDOWN:
			return { ...state, countingDown: false }
		default:
			return { ...state, gameState: getCurrentGameReducer()(state)(state.gameState, { type, payload }, { currentPlayer: state.currentPlayer, scores: state.scores }) }
	}
}
