/** @jsx jsx */

import { jsx } from '@emotion/core'

export const name = 'Open deur'

export const description = `Elke vraag kent vier antwoorden die elk 20 seconden opleveren.

In deze ronde kost nadenken ook seconden van de spelende groep. Als een groep stopt voordat alle vier antwoorden gegeven zijn, dan mogen de andere kandidaten proberen de lijst af te maken beginnend met de groep met het minst aantal seconden.

Als de spelende groep geen antwoorden meer weet, moet die "pas" of "stop" zeggen.`

export const initialState = () => ({ currentChoice: null })

export const ControlPad = () => <p>
	<button>Afspelen</button>
	<ul>
		{[...Object.keys(answers)].map(answer => <li key={answer} onClick={() => updateGameState({ ...gameState, [answer]: true })}>{answer}</li>)}
	</ul>
</p>

export const Viewport = ({ config: { videoUrl } }) =>
	<video>
		<source src={videoUrl} />
	</video>
