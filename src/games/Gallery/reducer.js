import { NEXT_SET, NEXT_PICTURE } from './actions'

export default ({ sets }) => (state = { currentSet: 0, currentImage: 0 }, { type, payload }) => {
	switch (type) {
		case NEXT_SET:
			return { ...state, currentSet: Math.min(sets.length - 1, state.currentSet + 1), currentImage: 0 }
		case NEXT_PICTURE:
			return { ...state, currentImage: Math.min(sets[state.currentSet].length - 1, state.currentImage + 1) }
		default:
			return state
	}
}
