import {
	PLAY_PAUSE, SHOW_ANSWERS, NEXT_ROUND, FOUND_ANSWER, START, STOP, TO_POSTROUND,
} from './actions'
import { calculateNextPlayerMap, calculatePlayerOrder } from '../player-order'
import { without } from 'ramda'

export default ({ videos }) => (state, { type, payload }, { currentPlayer, scores }) => {
	if (state === undefined) {
		const playerOrder = calculatePlayerOrder(scores)
		const nextPlayerMap = calculateNextPlayerMap(playerOrder)

		state = { currentVideo: 0, phase: 'VIDEO_PLAYING', playing: false, firstPlayer: playerOrder[0], nextPlayerMap, found: { }, points: { } }
	}

	switch (type) {
		case PLAY_PAUSE:
			return { ...state, playing: !state.playing }
		case SHOW_ANSWERS:
			return {
				...state,
				playing: false,
				phase: 'PLAYER_PREPARATION',
				currentMainPlayer: currentPlayer,
				nextSubPlayerMap: calculateNextPlayerMap([currentPlayer, ...without([currentPlayer], calculatePlayerOrder(scores))]),
			}
		case START:
			return { ...state, phase: 'THINKING' }
		case STOP:
			return { ...state, phase: 'PLAYER_PREPARATION' }
		case TO_POSTROUND:
			return { ...state, phase: 'POSTROUND', found: Object.fromEntries(videos[state.currentVideo].answers.map(answer => [answer, true])) }
		case NEXT_ROUND:
			return { ...state, phase: 'VIDEO_PLAYING', currentVideo: Math.min(videos.length - 1, state.currentVideo + 1), playing: false, found: { }, points: { } }
		case FOUND_ANSWER:
			return {
				...state,
				found: { ...state.found, [payload.answer]: true },
				points: { ...state.points, [payload.answer]: (Object.keys(state.found).length + 1) * 10 },
			}
		default:
			return state
	}
}