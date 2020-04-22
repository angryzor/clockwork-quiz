import { NEXT_ROUND, PREVIOUS_PICTURE, NEXT_PICTURE, START, TO_POSTROUND, TO_COMPLETION, FOUND_ANSWER, CORRECT_ANSWER, COMPLETION_START, COMPLETION_STOP, } from './actions'
import { calculateNextPlayerMap, calculatePlayerOrder } from '../player-order'
import { without } from 'ramda'

export default ({ sets }) => (state, { type, payload }, { currentPlayer, scores }) => {
	if (state === undefined) {
		const playerOrder = calculatePlayerOrder(scores)
		const nextPlayerMap = calculateNextPlayerMap(playerOrder)

		state = { currentSet: 0, currentImage: 0, phase: 'PREROUND', firstPlayer: playerOrder[0], nextPlayerMap }
	}

	switch (type) {
		case START:
			return { ...state, phase: 'THINKING' }
		case TO_COMPLETION:
			return {
				...state,
				phase: 'COMPLETION',
				currentMainPlayer: currentPlayer,
				nextSubPlayerMap: calculateNextPlayerMap([currentPlayer, ...without([currentPlayer], calculatePlayerOrder(scores))]),
			}
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
		default:
			return state
	}
}
