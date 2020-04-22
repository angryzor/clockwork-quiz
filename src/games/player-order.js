import { pipe, addIndex, map, sortBy, prop, pluck, zip, drop } from 'ramda'

export const calculatePlayerOrder = pipe(
	addIndex(map)((score, playerId) => ({ score, playerId })),
	sortBy(prop('score')),
	pluck('playerId'),
)

export const calculateNextPlayerMap = playerOrder =>
	new Map(zip(playerOrder, drop(1, playerOrder)))
