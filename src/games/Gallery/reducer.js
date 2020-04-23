import { NEXT_ROUND, PREVIOUS_PICTURE, NEXT_PICTURE, START, TO_POSTROUND, TO_COMPLETION, FOUND_ANSWER, CORRECT_ANSWER, COMPLETION_START, COMPLETION_STOP, } from './actions'
import { calculateNextPlayerMap, calculatePlayerOrder, dropPlayerFromNextPlayerMap } from '../player-order'
import { without } from 'ramda'
import { PLAYER_ELIMINATED } from '../../state/actions'

export default ({ sets }) => (state, { type, payload }, { currentPlayer, teams }) => {
	if (state === undefined) {
		const playerOrder = calculatePlayerOrder(teams)
		const nextPlayerMap = calculateNextPlayerMap(playerOrder)

		state = { currentSet: 0, currentImage: 0, phase: 'PREROUND', firstPlayer: playerOrder[0], nextPlayerMap }
	}

	switch (type) {
		case START:
			return { ...state,
				phase: 'THINKING',
				currentMainPlayer: currentPlayer,
				nextSubPlayerMap: calculateNextPlayerMap([currentPlayer, ...without([currentPlayer], calculatePlayerOrder(teams))]),
			}
		case TO_COMPLETION:
			return { ...state, phase: 'COMPLETION' }
		case COMPLETION_START:
			return { ...state, phase: 'COMPLETION_THINKING' }
		case COMPLETION_STOP:
			return { ...state, phase: 'COMPLETION' }
		case FOUND_ANSWER:
			return { ...state, found: { ...state.found, [payload.answer]: true } }
		case CORRECT_ANSWER:
			return { ...state, found: { ...state.found, [sets[state.currentSet][state.currentImage].name]: true } }
		case TO_POSTROUND:
			return { ...state, phase: 'POSTROUND', currentImage: 0 }
		case NEXT_ROUND:
			return { ...state, phase: 'PREROUND', currentSet: Math.min(sets.length - 1, state.currentSet + 1), currentImage: 0, found: { } }
		case PREVIOUS_PICTURE:
			return { ...state, currentImage: Math.max(0, state.currentImage - 1) }
		case NEXT_PICTURE:
			return { ...state, currentImage: Math.min(sets[state.currentSet].length - 1, state.currentImage + 1) }
		case PLAYER_ELIMINATED:
			return { ...state, nextPlayerMap: dropPlayerFromNextPlayerMap(currentPlayer, state.nextPlayerMap) }
		default:
			return state
	}
}
