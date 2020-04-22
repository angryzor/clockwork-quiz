import { pipe, map, sortBy, prop, pluck, zip, drop } from 'ramda'

export const calculatePlayerOrder = pipe(
	map(({ score, name }) => ({ score, name })),
	sortBy(prop('score')),
	pluck('name'),
)

export const calculateNextPlayerMap = (playerOrder, cycle = false) =>
	new Map(zip(playerOrder, [...drop(1, playerOrder), ...cycle ? [playerOrder[0]] : []]))
