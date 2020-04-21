import * as Puzzle from './Puzzle'
import * as Questions from './Questions'
import * as OpenDoor from './OpenDoor'
import * as Gallery from './Gallery'
import * as CollectiveMemory from './CollectiveMemory'

const games = new Map([
	['puzzle', Puzzle],
	['questions', Questions],
	['open-door', OpenDoor],
	['gallery', Gallery],
	['collective-memory', CollectiveMemory]
])

export const getGame = type => games.get(type)
