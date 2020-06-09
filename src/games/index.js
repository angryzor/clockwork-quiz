import * as Puzzle from './Puzzle'
import * as Questions from './Questions'
import * as OpenDoor from './OpenDoor'
import * as Gallery from './Gallery'
import * as CollectiveMemory from './CollectiveMemory'
import * as Finale from './Finale'

const games = new Map([
	['puzzle', Puzzle],
	['questions', Questions],
	['open-door', OpenDoor],
	['gallery', Gallery],
	['collective-memory', CollectiveMemory],
	['finale', Finale],
])

export const getGame = type => games.get(type)
