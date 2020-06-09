import { combineEpics, ofType } from 'redux-observable'
import { map, concatMap, withLatestFrom, filter } from 'rxjs/operators'
import { FOUND_ANSWER, START, STOP, NEXT_ROUND } from './actions'
import { switchPlayer, startCountdown, stopCountdown, nextGame, modifyScore, correctSound } from '../../state/action-creators'
import { INITIALIZE_GAME, PLAYER_ELIMINATED } from '../../state/actions'
import { getCurrentPlayer, getCurrentGameState, getTeams } from '../../state/selectors'
import { toPostRound } from './action-creators'
import { from } from 'rxjs'

export default ({ questions }) => combineEpics(
	(action$, state$) => action$.pipe(
		ofType(INITIALIZE_GAME, NEXT_ROUND),
		withLatestFrom(state$),
		map(([, state]) => {
			const gameState = getCurrentGameState()(state)

			return switchPlayer(gameState.playerOrder[0])
		}),
	),

	(action$, state$) => action$.pipe(
		ofType(FOUND_ANSWER),
		withLatestFrom(state$),
		concatMap(([, state]) => {
			const gameState = getCurrentGameState()(state)
			const teams = getTeams()(state)
			const player = getCurrentPlayer()(state)

			return from([
				...teams.filter(({ name }) => name !== player).map(({ name }) => modifyScore(name, -20)),
				...Object.keys(gameState.found).length === questions[gameState.currentQuestion].answers.length ? [stopCountdown(), toPostRound()] : [],
				correctSound(),
			])
		}),
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
			const nextPlayer = gameState.nextPlayerMap.get(getCurrentPlayer()(state))

			return from([
				stopCountdown(),
				nextPlayer == null ? toPostRound() : switchPlayer(nextPlayer),
			])
		}),
	),

	(action$, state$) => action$.pipe(
		ofType(PLAYER_ELIMINATED),
		withLatestFrom(state$),
		filter(([{ payload: { player } }, state]) => player === getCurrentPlayer()(state)),
		concatMap(([, state]) => {
			const gameState = getCurrentGameState()(state)
			const nextPlayer = gameState.nextPlayerMap.get(getCurrentPlayer()(state))

			return from([
				stopCountdown(),
				nextPlayer == null ? toPostRound() : switchPlayer(nextPlayer),
			])
		}),
	)
)
