import { map, always } from 'ramda'
import { TOGGLE_ANSWER } from './actions'

export default ({ answers }) => (state = { found: map(always(false), answers) }, { type, payload }) => {
	switch (type) {
		case TOGGLE_ANSWER:
			return { ...state, found: { ...state.found, [payload.answer]: payload.value } }
		default:
			return state
	}
}
