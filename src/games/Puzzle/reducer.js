import { TOGGLE_ANSWER } from './actions'

export default ({ answers }) => (state = { found: { } }, { type, payload }) => {
	switch (type) {
		case TOGGLE_ANSWER:
			return { ...state, found: { ...state.found, [payload.answer]: payload.value } }
		default:
			return state
	}
}
