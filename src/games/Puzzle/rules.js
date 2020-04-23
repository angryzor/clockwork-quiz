import { combineEpics, ofType } from 'redux-observable'
import { map, concatMap, withLatestFrom } from 'rxjs/operators'
import { FOUND_ANSWER, START, STOP, NEXT_ROUND } from './actions'
import { switchPlayer, modifyScore, startCountdown, stopCountdown, nextGame } from '../../state/action-creators'
import { INITIALIZE_GAME, PLAYER_ELIMINATED } from '../../state/actions'
import { getCurrentPlayer, getCurrentGameState } from '../../state/selectors'
import { stop } from './action-creators'
import { from } from 'rxjs'

export default ({ puzzles }) => combineEpics(
	(action$, state$) => action$.pipe(
		ofType(INITIALIZE_GAME),
		withLatestFrom(state$),
		map(([, state]) => {
			const gameState = getCurrentGameState()(state)

			return switchPlayer(gameState.firstPlayer)
		}),
	),

	(action$, state$) => action$.pipe(
		ofType(NEXT_ROUND),
		withLatestFrom(state$),
		map(([, state]) => {
			const gameState = getCurrentGameState()(state)
			const nextPlayer = gameState.nextPlayerMap.get(getCurrentPlayer()(state))

			return nextPlayer == null ? nextGame() : switchPlayer(nextPlayer)
		}),
	),

	(action$, state$) => action$.pipe(
		ofType(FOUND_ANSWER),
		withLatestFrom(state$),
		concatMap(([, state]) => {
			const gameState = getCurrentGameState()(state)

			return from([
				modifyScore(20),
				...Object.keys(gameState.found).length === puzzles[gameState.currentPuzzle].answers.length ? [stop()] : [],
			])
		})
	),

	(action$) => action$.pipe(
		ofType(START),
		map(() => startCountdown()),
	),

	(action$) => action$.pipe(
		ofType(STOP),
		map(() => stopCountdown())
	),

	(action$) => action$.pipe(
		ofType(PLAYER_ELIMINATED),
		map(() => stop())
	)
)
