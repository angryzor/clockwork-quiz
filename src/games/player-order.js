import { pipe, map, sortBy, prop, pluck, zip, drop } from 'ramda'

export const calculatePlayerOrder = pipe(
	map(({ score, name }) => ({ score, name })),
	sortBy(prop('score')),
	pluck('name'),
)

export const calculateNextPlayerMap = (playerOrder, cycle = false) =>
	new Map(zip(playerOrder, [...drop(1, playerOrder), ...cycle ? [playerOrder[0]] : []]))

export const dropPlayerFromNextPlayerMap = (player, map) => {
	const m = new Map(map)
	const prevPlayer = [...m.entries()].find(([, v]) => v === player)

	if (prevPlayer != null) {
		m.set(prevPlayer[0], m.get(player))
	}

	// m.delete(player)

	return m
}
