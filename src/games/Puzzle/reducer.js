import { FOUND_ANSWER, START, STOP, NEXT_ROUND } from './actions'
import { calculateNextPlayerMap, calculatePlayerOrder } from '../player-order'
import { chain, map, addIndex } from 'ramda'
import shuffle from 'lodash.shuffle'

const unfoldContexts = addIndex(chain)(({ name, contexts }, colorIndex) => map(text => ({ answer: name, colorIndex, text }), contexts))

export default ({ puzzles }) => (state, { type, payload }, { scores }) => {
	if (state === undefined) {
		const playerOrder = calculatePlayerOrder(scores)
		const nextPlayerMap = calculateNextPlayerMap(playerOrder)

		state = { currentPuzzle: 0, phase: 'PLAYER_PREPARATION', firstPlayer: playerOrder[0], nextPlayerMap, found: { }, contexts: shuffle(unfoldContexts(puzzles[0].answers)) }
	}

	switch (type) {
		case START:
			return { ...state, phase: 'THINKING' }
		case STOP:
			return { ...state, phase: 'POSTROUND', found: Object.fromEntries(puzzles[state.currentPuzzle].answers.map(({ name }) => [name, true])) }
		case NEXT_ROUND: {
			const currentPuzzle = Math.min(puzzles.length - 1, state.currentPuzzle + 1)

			return { ...state, phase: 'PLAYER_PREPARATION', currentPuzzle, found: { }, contexts: shuffle(unfoldContexts(puzzles[currentPuzzle].answers)) }
		}
		case FOUND_ANSWER:
			return { ...state, found: { ...state.found, [payload.answer]: true } }
		default:
			return state
	}
}
