/** @jsx jsx */

import { useState } from 'react'
import { connect } from 'react-redux'
import { css, jsx } from '@emotion/core'
import { map, chain, pipe, pick } from 'ramda'
import shuffle from 'lodash.shuffle'
import * as actionCreators from './action-creators'
import { getCurrentGameState } from '../../state/selectors'

const unfoldContexts = chain(({ name, color, contexts }) => map(text => ({ answer: name, color, text }), contexts))

const Context = ({ text, disabled, color }) => <section css={css`
	width: 244px;
	height: 84px;
	display: flex;
	justify-content: center;
	align-items: center;

	transition-property: background-color;
	transition-duration: 0.6s;

	border: solid 12px white;

	background-color: ${disabled ? 'white' : color};
`}>
	<p>{text}</p>
</section>

export const ControlPad = connect(
	state => pipe(getCurrentGameState(), pick(['found']))(state),
	actionCreators,
)(({ config: { answers }, found, toggleAnswer }) => <ul>
	{answers.map(({ name }) => <label key={name} css={{ display: 'block' }}><input
		type="checkbox"
		value={found[name] || false}
		onChange={event => toggleAnswer(name, event.target.checked)}
	/>{name}</label>)}
</ul>)

export const Viewport = connect(
	state => pipe(getCurrentGameState(), pick(['found']))(state),
)(({ config: { answers }, found }) => {
	const [contexts] = useState(shuffle(unfoldContexts(answers)))

	return <article css={css`
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: row;
		padding: 122px;
	`}>
		<div css={css`
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
		`}>
			<div css={css`
				grid-template-columns: repeat(3, 1fr);
				gap: 1px;
				display: grid;
				background-color: lightgrey;
				box-shadow: inset 0 0 0 12px white;
			`}>
				{contexts.map(({ answer, text, color }) => <Context key={text} text={text} color={color} disabled={!found[answer]} />)}
			</div>
		</div>
		<div css={css`
			width: 300px;
			display: flex;
			align-items: center;
			justify-content: center;
			overflow: hidden;
		`}>
			<ul>
				{answers.filter(({ name }) => found[name] || false).map(({ name, color }) =>
					<li key={name} css={css`
						list-style: none;
						margin: 1em;

						display: flex;
						flex-direction: row;
					`}>
						<div css={css`
							padding-right: 1em;
						`}>20</div>
						<div css={css`
							flex: 1;
							font-weight: 700;

							color: ${color};
						`}>{name}</div>
					</li>
				)}
			</ul>
		</div>
	</article>
})
