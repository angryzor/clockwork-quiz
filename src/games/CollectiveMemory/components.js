/** @jsx jsx */
/** @jsxFrag React.Fragment */

import React from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import * as actionCreators from './action-creators'
import { pipe, pick } from 'ramda'
import { getCurrentGameState } from '../../state/selectors'
import VideoPlayer from '../../components/VideoPlayer'

export const ControlPad = connect(
	state => pipe(getCurrentGameState(), pick(['currentVideo', 'found', 'phase']))(state),
	actionCreators,
)(({ config: { videos }, phase, currentVideo, found, playPause, nextRound, showAnswers, foundAnswer, start, stop }) => {
	switch (phase) {
		case 'VIDEO_PLAYING':
			return <div>
				<button onClick={() => playPause()}>Afspelen / Pauze</button>
				<button onClick={() => showAnswers()}>Toon antwoorden</button>
			</div>
		case 'PLAYER_PREPARATION':
			return <button onClick={() => start()}>START</button>
		case 'THINKING':
			return <div>
				<button onClick={() => stop()}>STOP</button>
				{videos[currentVideo].answers.map(answer =>
					<button css={{ display: 'block' }} key={answer} disabled={found[answer] || false} onClick={() => foundAnswer(answer)}>{answer}</button>
				)}
			</div>
		case 'POSTROUND':
			return <button onClick={() => nextRound()}>Volgende ronde</button>
		// no default
	}
})

export const Viewport = connect(
	state => pipe(getCurrentGameState(), pick(['currentVideo', 'playing', 'found', 'points', 'phase']))(state),
)(({ config: { videos }, currentVideo, playing, found, points, phase }) => {
	const { answers, videoUrl, vertical } = videos[currentVideo]

	return <article css={css`
		flex: 1;
	`}>
		<VideoPlayer
			videoUrl={videoUrl}
			vertical={vertical}
			playing={playing}
			answers={answers.map((answer, i) => ({ name: answer, points: points[answer] }))}
			found={found}
			answersVisible={phase !== 'VIDEO_PLAYING'}
		/>
	</article>
})
