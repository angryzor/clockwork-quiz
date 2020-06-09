import { combineEpics, ofType } from 'redux-observable'
import * as GameManager from './actions'
import { getCurrentGameRules, getTeam, getCurrentPlayer, getCurrentGameType, getTeams } from './selectors'
import { withLatestFrom, switchMap, distinctUntilKeyChanged, map, tap, ignoreElements, filter } from 'rxjs/operators'
import { never, interval } from 'rxjs'
import { modifyCurrentPlayerScore, initializeGame, playerEliminated, modifyScore, stopCountdown } from './action-creators'
import { Howl } from 'howler'
import config from '../config'

const nextGame = new Howl({ src: config.sounds.nextGame })
const clockStart = new Howl({ src: config.sounds.clockStart })
const clockStop = new Howl({ src: config.sounds.clockStop })
const correct = new Howl({ src: config.sounds.correct })
const finale = new Howl({ src: config.sounds.finale })

export default combineEpics(
	(action$) => action$.pipe(
		ofType(GameManager.START_COUNTDOWN, GameManager.STOP_COUNTDOWN),
		distinctUntilKeyChanged('type'),
		switchMap(({ type }) => type === GameManager.START_COUNTDOWN ? interval(1000) : never()),
		map(() => modifyCurrentPlayerScore(-1)),
	),

	(action$, state$) => action$.pipe(
		ofType(GameManager.START_GAME),
		withLatestFrom(state$),
		switchMap(([_, state]) => getCurrentGameRules()(state)(action$, state$)),
	),

	(action$) => action$.pipe(
		ofType(GameManager.START_GAME),
		map(() => initializeGame()),
	),

	(action$, state$) => action$.pipe(
		ofType(GameManager.NEXT_GAME),
		withLatestFrom(state$),
		tap(([, state]) => {
			if (getCurrentGameType()(state) === 'finale') {
				finale.play()
			} else {
				nextGame.play()
			}
		}),
		ignoreElements(),
	),

	(action$, state$) => action$.pipe(
		ofType(GameManager.PLAYER_ELIMINATED),
		withLatestFrom(state$),
		filter(([, state]) => getTeams()(state).length === 1),
		map(() => stopCountdown())
	),

	(action$) => action$.pipe(
		ofType(GameManager.START_COUNTDOWN),
		tap(() => clockStart.play()),
		ignoreElements(),
	),

	(action$) => action$.pipe(
		ofType(GameManager.STOP_COUNTDOWN),
		tap(() => {
			clockStart.stop()
			clockStop.play()
		}),
		ignoreElements(),
	),

	(action$) => action$.pipe(
		ofType(GameManager.CORRECT_SOUND),
		tap(() => correct.play()),
		ignoreElements(),
	),

	(action$, state$) => action$.pipe(
		ofType(GameManager.MODIFY_CURRENT_PLAYER_SCORE),
		withLatestFrom(state$),
		map(([{ payload: { value } }, state]) => modifyScore(getCurrentPlayer()(state), value)),
	),

	(action$, state$) => action$.pipe(
		ofType(GameManager.MODIFY_SCORE),
		withLatestFrom(state$),
		filter(([{ payload: { player } }, state]) => getTeam(player)(state).score === 0),
		map(([{ payload: { player } }]) => playerEliminated(player))
	),
)