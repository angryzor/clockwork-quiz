import { combineEpics, ofType } from 'redux-observable'
import { withLatestFrom, concatMap, map } from 'rxjs/operators'
import { from } from 'rxjs'
import { nextQuestion } from './action-creators'
import { getCurrentGameState, getCurrentPlayer } from '../../state/selectors'
import { isPointsQuestion } from './util'
import { switchPlayer, modifyScore, nextGame } from '../../state/action-creators'
import { CORRECT_ANSWER, INCORRECT_ANSWER } from './actions'
import config from '../../config'

export default ({ questions }) => combineEpics(
	(action$, state$) => action$.pipe(
		ofType(CORRECT_ANSWER),
		withLatestFrom(state$),
		concatMap(([, state]) => {
			const currentQuestion = getCurrentGameState()(state).currentQuestion

			return from([
				...isPointsQuestion(currentQuestion) ? [modifyScore(10)] : [],
				currentQuestion === questions.length - 1 ? nextGame() : nextQuestion(),
			])
		}),
	),

	(action$, state$) => action$.pipe(
		ofType(INCORRECT_ANSWER),
		withLatestFrom(state$),
		map(([, state]) => switchPlayer((getCurrentPlayer()(state) + 1) % config.teams.length)),
	),
)