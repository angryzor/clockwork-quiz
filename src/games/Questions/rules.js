import { combineEpics, ofType } from 'redux-observable'
import { withLatestFrom, concatMap } from 'rxjs/operators'
import { from } from 'rxjs'
import { nextQuestion } from './action-creators'
import { getCurrentGameState, getCurrentPlayer } from '../../state/selectors'
import { isPointsQuestion } from './util'
import { switchPlayer, modifyScore, nextGame } from '../../state/action-creators'
import { CORRECT_ANSWER, INCORRECT_ANSWER } from './actions'

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
		concatMap(([, state]) => {
			const gameState = getCurrentGameState()(state)
			const nextPlayer = gameState.nextPlayerMap.get(getCurrentPlayer()(state))

			return [
				switchPlayer(nextPlayer),
				...nextPlayer === gameState.firstResponder ? [nextQuestion()] : [],
			]
		})
	),
)