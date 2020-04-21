import {
	PLAY_PAUSE, SHOW_ANSWERS, FOUND_ANSWER, NEXT_VIDEO,
} from './actions'


export default ({ videos }) => (state = { currentVideo: 0, found: { }, playing: false, answersVisible: false }, { type, payload }) => {
	switch (type) {
		case NEXT_VIDEO:
			return { ...state, currentVideo: Math.min(videos.length - 1, state.currentVideo + 1), playing: false, answersVisible: false, found: { } }
		case PLAY_PAUSE:
			return { ...state, playing: !state.playing }
		case SHOW_ANSWERS:
			return { ...state, playing: false, answersVisible: true }
		case FOUND_ANSWER:
			return { ...state, found: { ...state.found, [payload.answer]: true } }
		default:
			return state
	}
}