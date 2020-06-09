/** @jsx jsx */
/** @jsxFrag React.Fragment */

import React from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import * as actionCreators from './action-creators'
import { pipe, pick, applySpec } from 'ramda'
import { getCurrentGameState, getTeams, getCurrentPlayer } from '../../state/selectors'

export const ControlPad = connect(
	state => pipe(getCurrentGameState(), pick(['currentQuestion', 'phase', 'found']))(state),
	actionCreators,
)(({ config: { questions }, currentQuestion, found, nextRound, start, stop, phase, foundAnswer }) => {
	switch (phase) {
		case 'PREROUND':
		case 'PLAYER_PREPARATION':
			return <section>
				<button onClick={() => start()}>START</button>
				<div>{questions[currentQuestion].question}</div>
			</section>
		case 'THINKING':
			return <div>
				<button onClick={() => stop()}>STOP</button>
				{questions[currentQuestion].answers.map(answer =>
					<button css={{ display: 'block' }} key={answer} disabled={found[answer] || false} onClick={() => foundAnswer(answer)}>{answer}</button>
				)}
				<div>{questions[currentQuestion].question}</div>
			</div>
		case 'POSTROUND':
			return <section>
				<button css={{ display: 'block' }} onClick={() => nextRound()}>Volgende vraag</button>
			</section>
		// no default
	}
})

export const Viewport = connect(
	state => applySpec({
		gameState: pipe(getCurrentGameState(), pick(['currentQuestion', 'phase', 'found'])),
		teams: getTeams(),
		currentPlayer: getCurrentPlayer(),
	})(state),
)(({ config: { questions }, gameState: { currentQuestion, found }, teams, currentPlayer }) => <section css={css`
	width: 100%;
	height: 100%;
	padding: 104px 122px;
	display: flex;
`}>
	<div css={css`
		position: relative;
		flex: 1;
		display: flex;
		flex-direction: column;
	`}>
		{teams.map((team, i) => <div key={team.name} css={css`
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			margin: 12px;

			background-color: rgba(253, 230, 210);
			${team.name === currentPlayer ? css`
				border: solid 4px #F58220;
			` : {}};
		`}>
			<div css={css`
				margin-bottom: 16px;
				font-size: 22px;
				line-height: 25px;
			`}>{team.score}</div>
			<div css={css`
				font-weight: 700;
			`}>{team.name}</div>
			<div>{team.members}</div>
		</div>)}
	</div>
	<div css={css`
		width: 380px;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	`}>
		<ul>
			{questions[currentQuestion].answers.map(answer =>
				<li key={answer} css={css`
					list-style: none;
					margin: 1em;
					width: 300px;
					font-weight: 700;
					font-size: 24px;
					line-height: 28px;

					transition-property: filter;
					transition-duration: 0.6s;

					${found[answer] ? {} : css`
						filter: blur(15px);
					`}
				`}>{answer}</li>
			)}
		</ul>
	</div>
</section>)
