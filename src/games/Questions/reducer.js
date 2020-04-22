import { PREVIOUS_QUESTION, NEXT_QUESTION } from './actions'
import { calculateNextPlayerMap } from '../player-order'

export default ({ questions }) => (state, { type, payload }, { currentPlayer, teams }) => {
	if (state === undefined) {
		const nextPlayerMap = calculateNextPlayerMap(teams.map(team => team.name), true)

		state = { currentQuestion: 0, firstPlayer: teams[0].name, nextPlayerMap }
	}

	switch (type) {
		case PREVIOUS_QUESTION:
			return { ...state, currentQuestion: Math.max(0, state.currentQuestion - 1) }
		case NEXT_QUESTION:
			return { ...state, currentQuestion: Math.min(questions.length - 1, state.currentQuestion + 1), firstResponder: currentPlayer }
		default:
			return state
	}
}
