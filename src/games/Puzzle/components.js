/** @jsx jsx */

import { useState } from 'react'
import { connect } from 'react-redux'
import { css, jsx } from '@emotion/core'
import { map, chain, toPairs, pipe, pick } from 'ramda'
import shuffle from 'lodash.shuffle'
import * as actionCreators from './action-creators'
import { getCurrentGameState } from '../../state/selectors'

const unfoldContexts = pipe(
	toPairs,
	chain(([answer, { color, contexts }]) => map(text => ({ answer, color, text }), contexts)),
)

const Context = ({ text, disabled, color }) => <section css={css`
	flex: 1 1 33%;
	display: flex;
	justify-content: center;
	align-items: center;

	transition-property: background-color;
	transition-duration: 0.6s;

	${disabled ? {} : css`
		background-color: ${color};
	`}
`}>
	<p>{text}</p>
</section>

export const ControlPad = connect(
	state => pipe(getCurrentGameState(), pick(['found']))(state),
	actionCreators,
)(({ config: { answers }, found, toggleAnswer }) => <ul>
	{[...Object.keys(answers)].map(answer => <label key={answer} css={{ display: 'block' }}><input
		type="checkbox"
		value={found[answer] || false}
		onChange={event => toggleAnswer(answer, event.target.checked)}
	/>{answer}</label>)}
</ul>)

export const Viewport = connect(
	state => pipe(getCurrentGameState(), pick(['found']))(state),
)(({ config: { title, answers }, found }) => {
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
			{contexts.map(({ answer, text, color }) => <Context key={text} text={text} color={color} disabled={!found[answer]} />)}
		</div>
	</article>
})
