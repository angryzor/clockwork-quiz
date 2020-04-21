import { combineEpics, ofType } from 'redux-observable'
import * as GameManager from './actions'
import { getCurrentGameRules } from './selectors'
import { withLatestFrom, switchMap, distinctUntilKeyChanged, map } from 'rxjs/operators'
import { never, interval } from 'rxjs'
import { modifyScore, initializeGame } from './action-creators'

export default combineEpics(
	(action$) => action$.pipe(
		ofType(GameManager.START_COUNTDOWN, GameManager.STOP_COUNTDOWN),
		distinctUntilKeyChanged('type'),
		switchMap(({ type }) => type === GameManager.START_COUNTDOWN ? interval(1000) : never()),
		map(() => modifyScore(-1)),
	),

	(action$, state$) => action$.pipe(
		ofType(GameManager.START_GAME),
		withLatestFrom(state$),
		switchMap(([_, state]) => getCurrentGameRules()(state)(action$, state$)),
	),

	(action$) => action$.pipe(
		ofType(GameManager.START_GAME),
		map(() => initializeGame()),
	)
)