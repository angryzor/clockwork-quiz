/** @jsx jsx */
/** @jsxFrag React.Fragment */

import React from 'react'
import { connect } from 'react-redux'
import { css, jsx } from '@emotion/core'
import { times, pipe, pick } from 'ramda'
import * as actionCreators from './action-creators'
import { getCurrentGameState } from '../../state/selectors'

const DIVIDER = 3

export const ControlPad = connect(
	null,
	actionCreators,
)(({ previousQuestion, nextQuestion }) => <section css={css`
	display: flex;
	justify-content: space-between;
`}>
	<button onClick={() => previousQuestion()}>Vorige vraag</button>
	<button onClick={() => nextQuestion()}>Volgende vraag</button>
</section>)

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

export const Viewport = connect(
	state => pipe(getCurrentGameState(), pick(['currentQuestion']))(state),
)(({ config: { questions }, currentQuestion }) => <article css={css`
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
		</>, currentQuestion)}
		<RoundIndicator state="CURRENT" round={currentQuestion} />
		{times(i => <>
			<div css={css`
				flex: 1;
			`}/>
			<RoundIndicator state="FUTURE" round={i + currentQuestion + 1} />
		</>, questions.length - currentQuestion - 1)}
	</section>
	<section id="question" css={css`
		flex: 1;
		text-align: center;
		font-size: 14pt;
	`} dangerouslySetInnerHTML={{__html: questions[currentQuestion]}}/>
</article>)
