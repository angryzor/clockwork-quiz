import {
	STEP,
} from './actions'
import { getCurrentGameReducer } from './selectors'

export default (state = { currentGame: 0, gameState: undefined, playState: 'DESCRIPTION' }, { type, payload }) => {
	switch (type) {
		case STEP:
			if (state.playState === 'PLAYING') {
				return { ...state, currentGame: state.currentGame + 1, gameState: undefined, playState: 'DESCRIPTION' }
			} else {
				return { ...state, playState: 'PLAYING', gameState: getCurrentGameReducer()(state)(undefined, { type, payload }) }
			}
		default:
			return { ...state, gameState: getCurrentGameReducer()(state)(state.gameState, { type, payload }) }
	}
}
