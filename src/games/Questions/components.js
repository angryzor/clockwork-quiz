/** @jsx jsx */
/** @jsxFrag React.Fragment */

import React from 'react'
import { connect } from 'react-redux'
import { css, jsx } from '@emotion/core'
import { times, pipe, pick } from 'ramda'
import * as actionCreators from './action-creators'
import { getCurrentGameState } from '../../state/selectors'
import { isPointsQuestion } from './util'

export const ControlPad = connect(
	null,
	actionCreators,
)(({ previousQuestion, nextQuestion, correctAnswer, incorrectAnswer }) => <section css={css`
	display: flex;
	justify-content: space-between;
`}>
	<button onClick={() => correctAnswer()}>Correct answer</button>
	<button onClick={() => incorrectAnswer()}>Incorrect answer</button>
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
	const isBigRound = isPointsQuestion(round)
	const size = isBigRound ? 52 : 32

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
		font-size: ${isBigRound ? 18 : 14}px;
		line-height: 28px;

		${stateStyle(state)}
	`}>{round + 1}</div>
}

export const Viewport = connect(
	state => pipe(getCurrentGameState(), pick(['currentQuestion']))(state),
)(({ config: { questions }, currentQuestion }) => <article css={css`
	width: 100%;
	height: 100%;
	position: relative;
`}>
	<section id="round-indicator" css={css`
		display: flex;
		align-items: center;
		position: absolute;
		top: 89px;
		left: 0px;
		width: 100%;
	`}>
		{times(i => <React.Fragment key={i}>
			<RoundIndicator state="PAST" round={i} />
			<div css={css`
				height: 2px;
				background-color: orange;
				flex: 1;
			`}/>
		</React.Fragment>, currentQuestion)}
		<RoundIndicator state="CURRENT" round={currentQuestion} />
		{times(i => <React.Fragment key={i}>
			<div css={css`
				flex: 1;
			`}/>
			<RoundIndicator state="FUTURE" round={i + currentQuestion + 1} />
		</React.Fragment>, questions.length - currentQuestion - 1)}
	</section>
	<section id="question" css={css`
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	`}>
		<div css={css`
			text-align: center;
			font-size: 36px;
			line-height: 46px;
		`} dangerouslySetInnerHTML={{__html: questions[currentQuestion]}}/>
	</section>
</article>)
