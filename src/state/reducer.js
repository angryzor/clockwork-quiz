import {
	STEP,
} from './actions'
import { getCurrentGame } from './selectors'

export default (state = { currentGame: 0, gameState: undefined, playState: 'DESCRIPTION' }, { type, payload }) => {
	switch (type) {
		case STEP:
			if (state.playState === 'PLAYING') {
				return { ...state, currentGame: state.currentGame + 1, gameState: undefined, playState: 'DESCRIPTION' }
			} else {
				return { ...state, playState: 'PLAYING', gameState: getCurrentGame()(state).reducer(undefined, { type, payload }) }
			}
		default:
			return { ...state, gameState: getCurrentGame()(state).reducer(state.gameState, { type, payload }) }
	}
}
