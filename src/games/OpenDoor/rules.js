import { combineEpics, ofType } from 'redux-observable'
import { map, concatMap, withLatestFrom } from 'rxjs/operators'
import { FOUND_ANSWER, START, STOP, BACK_TO_SELECTION } from './actions'
import { switchPlayer, modifyScore, startCountdown, stopCountdown, nextGame } from '../../state/action-creators'
import { INITIALIZE_GAME, PLAYER_ELIMINATED } from '../../state/actions'
import { getCurrentPlayer, getCurrentGameState } from '../../state/selectors'
import { toPostRound } from './action-creators'
import { from } from 'rxjs'

export default () => combineEpics(
	(action$, state$) => action$.pipe(
		ofType(INITIALIZE_GAME),
		withLatestFrom(state$),
		map(([, state]) => {
			const gameState = getCurrentGameState()(state)

			return switchPlayer(gameState.firstPlayer)
		}),
	),

	(action$, state$) => action$.pipe(
		ofType(BACK_TO_SELECTION),
		withLatestFrom(state$),
		map(([, state]) => {
			const gameState = getCurrentGameState()(state)
			const nextPlayer = gameState.nextPlayerMap.get(gameState.currentMainPlayer)

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
				...Object.keys(gameState.found).length === gameState.selected.answers.length ? [stopCountdown(), toPostRound()] : [],
			])
		})
	),

	(action$) => action$.pipe(
		ofType(START),
		map(() => startCountdown()),
	),

	(action$, state$) => action$.pipe(
		ofType(STOP),
		withLatestFrom(state$),
		concatMap(([, state]) => {
			const gameState = getCurrentGameState()(state)
			const nextPlayer = gameState.nextSubPlayerMap.get(getCurrentPlayer()(state))

			return from([
				stopCountdown(),
				nextPlayer == null ? toPostRound() : switchPlayer(nextPlayer),
			])
		})
	),

	(action$, state$) => action$.pipe(
		ofType(PLAYER_ELIMINATED),
		withLatestFrom(state$),
		map(([, state]) => {
			const gameState = getCurrentGameState()(state)
			const nextPlayer = gameState.nextSubPlayerMap.get(getCurrentPlayer()(state))

			return nextPlayer == null ? toPostRound() : switchPlayer(nextPlayer)
		})
	)
)
