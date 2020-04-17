/** @jsx jsx */
/** @jsxFrag React.Fragment */

import React from 'react'
import { css, jsx } from '@emotion/core'
import { times } from 'ramda'

const DIVIDER = 3

export const name = 'Ronde 3-6-9'

export const description = `In deze ronde kunnen jullie seconden verdienen.

Wanneer je groep een vraag goed beantwoordt blijven jullie aan de beurt. Antwoord je groep fout, dan gaat de vraag naar de volgende groep spelers.

Als jullie vraag 3, 6, 9, 12, 15 of 18 juist beantwoorden, wordt je groep beloond met 20 seconden.`

export const initialState = () => 2

export const ControlPad = ({ config: { questions }, gameState, updateGameState }) => <section css={css`
	display: flex;
	justify-content: space-between;
`}>
	<button onClick={() => updateGameState(Math.max(0, gameState - 1))}>Vorige vraag</button>
	<button onClick={() => updateGameState(Math.min(questions.length - 1, gameState + 1))}>Volgende vraag</button>
</section>

const stateStyle = state => {
	switch (state) {
		case 'CURRENT':
			return css`
				background-color: rgb(255, 140, 0);
			`
		case 'PAST':
			return css`
				background-color: rgb(255, 140, 0, 0.5);
			`
		case 'FUTURE':
			return css`
			`
		// no default
	}
}

const RoundIndicator = ({ state, round }) => {
	const size = (round + 1) % DIVIDER === 0 ? 48 : 32

	return <div css={css`
		box-sizing: border-box;
		width: ${size}px;
		height: ${size}px;
		border-radius: ${size / 2}px;
		border: solid 2px rgb(255, 140, 0);
		display: flex;
		align-items: center;
		justify-content: center;

		font-weight: 700;
		font-size: 10pt;

		${stateStyle(state)}
	`}>{round + 1}</div>
}

export const Viewport = ({ config: { questions }, gameState: currentRound }) => <article css={css`
	display: flex;
	flex-direction: column;
`}>
	<section id="round-indicator" css={css`
		display: flex;
		align-items: center;
		margin: 100px;
	`}>
		{times(i => <>
			<RoundIndicator state="PAST" round={i} />
			<div css={css`
				height: 2px;
				background-color: orange;
				flex: 1;
			`}/>
		</>, currentRound)}
		<RoundIndicator state="CURRENT" round={currentRound} />
		{times(i => <>
			<div css={css`
				flex: 1;
			`}/>
			<RoundIndicator state="FUTURE" round={i + currentRound + 1} />
		</>, questions.length - currentRound - 1)}
	</section>
	<section id="question" css={css`
		flex: 1;
		text-align: center;
		font-size: 14pt;
	`} dangerouslySetInnerHTML={{__html: questions[currentRound]}}/>
</article>
