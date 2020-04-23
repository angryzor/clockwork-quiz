import {
	CHOOSE_VIDEO, PLAY_PAUSE, SHOW_ANSWERS, BACK_TO_SELECTION, FOUND_ANSWER, START, STOP, TO_POSTROUND,
} from './actions'
import { calculateNextPlayerMap, calculatePlayerOrder, dropPlayerFromNextPlayerMap } from '../player-order'
import { without } from 'ramda'
import { PLAYER_ELIMINATED } from '../../state/actions'

export default () => (state, { type, payload }, { currentPlayer, teams }) => {
	if (state === undefined) {
		const playerOrder = calculatePlayerOrder(teams)
		const nextPlayerMap = calculateNextPlayerMap(playerOrder)

		state = { selected: null, picked: { }, phase: 'PREROUND', firstPlayer: playerOrder[0], nextPlayerMap }
	}

	switch (type) {
		case CHOOSE_VIDEO:
			return { ...state, selected: payload.video, picked: { ...state.picked, [payload.video.name]: true }, playing: false, phase: 'VIDEO_PLAYING', found: { } }
		case PLAY_PAUSE:
			return { ...state, playing: !state.playing }
		case SHOW_ANSWERS:
			return {
				...state,
				playing: false,
				phase: 'PLAYER_PREPARATION',
				currentMainPlayer: currentPlayer,
				nextSubPlayerMap: calculateNextPlayerMap([currentPlayer, ...without([currentPlayer], calculatePlayerOrder(teams))]),
			}
		case START:
			return { ...state, phase: 'THINKING' }
		case STOP:
			return { ...state, phase: 'PLAYER_PREPARATION' }
		case TO_POSTROUND:
			return { ...state, phase: 'POSTROUND', found: Object.fromEntries(state.selected.answers.map(answer => [answer, true])) }
		case BACK_TO_SELECTION:
			return { ...state, phase: 'PREROUND', selected: null }
		case FOUND_ANSWER:
			return { ...state, found: { ...state.found, [payload.answer]: true } }
		case PLAYER_ELIMINATED:
			return { ...state, phase: 'PLAYER_PREPARATION', nextPlayerMap: dropPlayerFromNextPlayerMap(currentPlayer, state.nextPlayerMap) }
		default:
			return state
	}
}