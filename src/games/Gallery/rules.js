import { combineEpics, ofType } from 'redux-observable'
import { map, concatMap, withLatestFrom } from 'rxjs/operators'
import { FOUND_ANSWER, START, STOP, TO_COMPLETION, NEXT_ROUND, COMPLETION_START, COMPLETION_STOP, CORRECT_ANSWER } from './actions'
import { switchPlayer, modifyScore, startCountdown, stopCountdown, nextGame } from '../../state/action-creators'
import { INITIALIZE_GAME, PLAYER_ELIMINATED } from '../../state/actions'
import { getCurrentPlayer, getCurrentGameState } from '../../state/selectors'
import { toPostRound, nextPicture, toCompletion } from './action-creators'
import { from } from 'rxjs'

export default ({ sets }) => combineEpics(
	(action$, state$) => action$.pipe(
		ofType(INITIALIZE_GAME),
		withLatestFrom(state$),
		map(([, state]) => {
			const gameState = getCurrentGameState()(state)

			return switchPlayer(gameState.firstPlayer)
		}),
	),

	(action$) => action$.pipe(
		ofType(START),
		map(() => startCountdown()),
	),

	(action$, state$) => action$.pipe(
		ofType(CORRECT_ANSWER),
		withLatestFrom(state$),
		concatMap(([, state]) => {
			const gameState = getCurrentGameState()(state)

			return from([
				modifyScore(10),
				...Object.keys(gameState.found).length === sets[gameState.currentSet].length
					? [stopCountdown(), toPostRound()]
					: [gameState.currentImage === sets[gameState.currentSet].length - 1 ? toCompletion() : nextPicture()],
			])
		})
	),

	(action$, state$) => action$.pipe(
		ofType(STOP),
		withLatestFrom(state$),
		map(([, state]) => {
			const gameState = getCurrentGameState()(state)

			return gameState.currentImage === sets[gameState.currentSet].length - 1 ? toCompletion() : nextPicture()
		})
	),

	(action$, state$) => action$.pipe(
		ofType(TO_COMPLETION),
		withLatestFrom(state$),
		concatMap(([, state]) => {
			const gameState = getCurrentGameState()(state)
			const nextPlayer = gameState.nextSubPlayerMap.get(getCurrentPlayer()(state))

			return [
				stopCountdown(),
				Object.keys(gameState.found).length === sets[gameState.currentSet].length ? toPostRound() : switchPlayer(nextPlayer),
			]
		})
	),

	(action$) => action$.pipe(
		ofType(COMPLETION_START),
		map(() => startCountdown()),
	),

	(action$, state$) => action$.pipe(
		ofType(COMPLETION_STOP),
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
		ofType(FOUND_ANSWER),
		withLatestFrom(state$),
		concatMap(([, state]) => {
			const gameState = getCurrentGameState()(state)

			return from([
				modifyScore(10),
				...Object.keys(gameState.found).length === sets[gameState.currentSet].length ? [stopCountdown(), toPostRound()] : [],
			])
		})
	),

	(action$, state$) => action$.pipe(
		ofType(NEXT_ROUND),
		withLatestFrom(state$),
		map(([, state]) => {
			const gameState = getCurrentGameState()(state)
			const nextPlayer = gameState.nextPlayerMap.get(gameState.currentMainPlayer)

			return nextPlayer == null ? nextGame() : switchPlayer(nextPlayer)
		}),
	),

	(action$, state$) => action$.pipe(
		ofType(PLAYER_ELIMINATED),
		withLatestFrom(state$),
		map(([, state]) => {
			const gameState = getCurrentGameState()(state)

			if (gameState.phase === 'THINKING') {
				return toPostRound()
			} else { // COMPLETION_THINKING
				const nextPlayer = gameState.nextSubPlayerMap.get(getCurrentPlayer()(state))

				return nextPlayer == null ? toPostRound() : switchPlayer(nextPlayer)
			}
		})
	),
)