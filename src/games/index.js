import * as Puzzle from './Puzzle'
import * as Questions from './Questions'
import * as OpenDoor from './OpenDoor'

const games = new Map([
	['puzzle', Puzzle],
	['questions', Questions],
	['open-door', OpenDoor],
])

export const getGame = type => games.get(type)
