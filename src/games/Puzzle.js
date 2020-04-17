/** @jsx jsx */
import { useState } from 'react'
import { css, jsx } from '@emotion/core'
import { map, chain, always, toPairs, pipe } from 'ramda'
import shuffle from 'lodash.shuffle'

const unfoldContexts = pipe(
	toPairs,
	chain(([answer, { color, contexts }]) => map(text => ({ answer, color, text }), contexts)),
)

export const name = 'Puzzel'

export const description = `Elke groep krijgt 12 woorden te zien waarvan er telkens 3x4 verbonden zijn. De groep moet het verband tussen de verschillende woorden aangeven. Per aangegeven verband verdienen zij 20 seconden.

Nadenken kost ook seconden

Andere kandidaten mogen de puzzel niet aanvullen wanneer de groep het opgeeft`

export const initialState = ({ answers }) =>
	map(always(false), answers)

const Context = ({ text, enabled, color }) => <section css={css`
	flex: 1 1 33%;
	display: flex;
	justify-content: center;
	align-items: center;

	transition-property: background-color;
	transition-duration: 0.6s;

	${enabled ? {} : css`
		background-color: ${color};
	`}
`}>
	<p>{text}</p>
</section>

export const ControlPad = ({ config: { answers }, gameState, updateGameState }) => <ul>
	{[...Object.keys(answers)].map(answer => <li key={answer} onClick={() => updateGameState({ ...gameState, [answer]: true })}>{answer}</li>)}
</ul>

export const Viewport = ({ config: { title, answers }, gameState }) => {
	const [contexts] = useState(shuffle(unfoldContexts(answers)))

	return <article css={css`
		flex: 1;
		display: flex;
		flex-direction: column;
	`}>
		<h1 css={css`
			height: 60px;
			margin: 0px;
			flex: none;
		`}>{title}</h1>
		<div css={css`
			flex: 1;
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 16px;
			margin: 160px;
		`}>
			{contexts.map(({ answer, text, color }) => <Context key={text} text={text} color={color} enabled={!gameState[answer]} />)}
		</div>
	</article>
}
