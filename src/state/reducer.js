import {
	NEXT_GAME, START_GAME, MODIFY_SCORE, SWITCH_PLAYER, START_COUNTDOWN, STOP_COUNTDOWN,
} from './actions'
import { getCurrentGameReducer } from './selectors'
import config from '../config'
import { add } from 'ramda'
import * as L from 'partial.lenses'

const initialState = {
	currentGame: 0,
	gameState: undefined,
	playState: 'DESCRIPTION',
	currentPlayer: config.teams[0].name,
	teams: config.teams.map(team => ({ ...team, score: 60 })),
	countingDown: false,
}

export default (state = initialState, { type, payload }) => {
	switch (type) {
		case NEXT_GAME:
			return { ...state, currentGame: state.currentGame + 1, gameState: undefined, playState: 'DESCRIPTION' }
		case START_GAME:
			return { ...state, playState: 'PLAYING', gameState: getCurrentGameReducer()(state)(undefined, { type, payload }, { currentPlayer: state.currentPlayer, teams: state.teams }) }
		case SWITCH_PLAYER:
			return { ...state, currentPlayer: payload.nextPlayer }
		case MODIFY_SCORE:
			return { ...state, teams: L.modify([L.find(t => t.name === state.currentPlayer), 'score'], add(payload.value), state.teams) }
		case START_COUNTDOWN:
			return { ...state, countingDown: true }
		case STOP_COUNTDOWN:
			return { ...state, countingDown: false }
		default:
			return { ...state, gameState: getCurrentGameReducer()(state)(state.gameState, { type, payload }, { currentPlayer: state.currentPlayer, teams: state.teams }) }
	}
}
