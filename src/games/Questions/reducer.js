import { PREVIOUS_QUESTION, NEXT_QUESTION } from "./actions";

export default ({ questions }) => (state = { currentQuestion: 0 }, { type, payload }) => {
	switch (type) {
		case PREVIOUS_QUESTION:
			return { ...state, currentQuestion: Math.max(0, state.currentQuestion - 1) }
		case NEXT_QUESTION:
			return { ...state, currentQuestion: Math.min(questions.length - 1, state.currentQuestion + 1) }
		default:
			return state
	}
}
