/** @jsx jsx */
/** @jsxFrag React.Fragment */

import React from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import * as actionCreators from './action-creators'
import { pipe, pick } from 'ramda'
import { getCurrentGameState } from '../../state/selectors'

export const ControlPad = connect(
	state => pipe(getCurrentGameState(), pick(['currentSet', 'currentImage', 'phase', 'found']))(state),
	actionCreators,
)(({ config: { sets }, currentSet, currentImage, found, nextRound, previousPicture, nextPicture, start, stop, completionStart, completionStop, phase, correctAnswer, foundAnswer }) => {
	switch (phase) {
		case 'PREROUND':
			return <section>
				<button onClick={() => start()}>START</button>
			</section>
		case 'THINKING':
			return <section>
				<button onClick={() => correctAnswer()}>Correct answer</button>
				<button onClick={() => stop()}>STOP / PAS</button>
				<div>Antwoord:<br/>{sets[currentSet][currentImage].name}</div>
			</section>
		case 'COMPLETION':
			return <section>
				<button onClick={() => completionStart()}>START</button>
			</section>
		case 'COMPLETION_THINKING':
			return <section>
				<button onClick={() => completionStop()}>STOP / PAS</button>
				{sets[currentSet].map(({ name }) =>
					<button css={{ display: 'block' }} key={name} disabled={found[name] || false} onClick={() => foundAnswer(name)}>{name}</button>
				)}
			</section>
		case 'POSTROUND':
			return <section>
				<button css={{ display: 'block' }} onClick={() => nextRound()}>Volgende ronde</button>
				<button css={{ display: 'block' }} onClick={() => previousPicture()}>Vorige afbeelding</button>
				<button css={{ display: 'block' }} onClick={() => nextPicture()}>Volgende afbeelding</button>
			</section>
		// no default
	}
})

export const Viewport = connect(
	state => pipe(getCurrentGameState(), pick(['currentSet', 'currentImage', 'phase']))(state),
)(({ config, currentSet, currentImage, phase }) => <section css={css`
	width: 100%;
	height: 100%;
	padding: 104px 122px;
`}>
	{phase === 'THINKING' || phase === 'POSTROUND'
	? <img
		src={config.sets[currentSet][currentImage].imageUrl}
		alt="Question"
		css={css`
			width: 100%;
			height: 100%;
			object-fit: contain;
		`}
	/>
	: phase === 'PREROUND'
	? <div css={css`
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	`}>
		<h1 css={css`
			font-size: 48px;
			line-height: 56px;
			color: #F58220;
		`}>Galerij {currentSet + 1}</h1>
	</div>
	: <div css={css`
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	`}>
		<h1 css={css`
			font-size: 48px;
			line-height: 56px;
			color: #F58220;
		`}>Aanvullingsronde</h1>
	</div>}
</section>)
