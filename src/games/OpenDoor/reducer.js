import {
	CHOOSE_VIDEO, PLAY_PAUSE, SHOW_ANSWERS, BACK_TO_SELECTION, FOUND_ANSWER
} from './actions'


export default () => (state = { selected: null, picked: { } }, { type, payload }) => {
	switch (type) {
		case CHOOSE_VIDEO:
			return { selected: payload.video, picked: { ...state.picked, [payload.video.name]: true }, playing: false, answersVisible: false, found: { } }
		case PLAY_PAUSE:
			return { ...state, playing: !state.playing }
		case SHOW_ANSWERS:
			return { ...state, playing: false, answersVisible: true }
		case BACK_TO_SELECTION:
			return { ...state, selected: null }
		case FOUND_ANSWER:
			return { ...state, found: { ...state.found, [payload.answer]: true } }
		default:
			return state
	}
}