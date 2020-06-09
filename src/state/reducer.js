import {
	NEXT_GAME, START_GAME, MODIFY_SCORE, SWITCH_PLAYER, START_COUNTDOWN, STOP_COUNTDOWN, PLAYER_ELIMINATED, REVEAL_WINNERS, REVEAL_NAMES,
} from './actions'
import { getCurrentGameReducer } from './selectors'
import config from '../config'
import * as L from 'partial.lenses'
import { take, pluck, prop, descend, sortWith } from 'ramda'

const initialState = {
	currentGame: -1,
	gameState: undefined,
	phase: 'TITLE_SCREEN',
	currentPlayer: config.teams[0].name,
	teams: config.teams,
	countingDown: false,
	namesVisible: false,
}

export default (state = initialState, { type, payload }) => {
	switch (type) {
		case NEXT_GAME:
			if (state.currentGame === config.games.length - 1) {
				return { ...state, phase: 'POSTGAME_SCREEN' }
			} else {
				const calcTeams = () => {
					if (config.games[state.currentGame + 1].type !== 'finale') {
						return state.teams
					} else {
						const highestTeams = take(2, pluck('name', sortWith([descend(prop('score'))], state.teams)))

						return state.teams.filter(({ name }) => highestTeams.includes(name))
					}
				}

				return {
					...state,
					currentGame: state.currentGame + 1,
					gameState: undefined,
					phase: 'DESCRIPTION',
					teams: calcTeams(),
				}
			}
		case START_GAME:
			return { ...state, phase: 'PLAYING', gameState: getCurrentGameReducer()(state)(undefined, { type, payload }, { currentPlayer: state.currentPlayer, teams: state.teams }) }
		case SWITCH_PLAYER:
			return { ...state, currentPlayer: payload.nextPlayer }
		case MODIFY_SCORE:
			return { ...state, teams: L.modify([L.find(t => t.name === payload.player), 'score'], score => Math.max(0, score + payload.value), state.teams) }
		case START_COUNTDOWN:
			return { ...state, countingDown: true }
		case STOP_COUNTDOWN:
			return { ...state, countingDown: false }
		case PLAYER_ELIMINATED: {
			const teams = L.remove(L.find(t => t.name === payload.player), state.teams)

			if (teams.length === 1) {
				return { ...state, phase: 'POSTGAME_SCREEN', teams }
			} else {
				return {
					...state,
					teams,
					gameState: getCurrentGameReducer()(state)(state.gameState, { type, payload }, { currentPlayer: state.currentPlayer, teams: state.teams })
				}
			}
		}
		case REVEAL_NAMES:
			return { ...state, namesVisible: true }

		default:
			return { ...state, gameState: state.gameState === undefined ? undefined : getCurrentGameReducer()(state)(state.gameState, { type, payload }, { currentPlayer: state.currentPlayer, teams: state.teams }) }
	}
}
