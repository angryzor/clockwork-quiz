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
	state => pipe(getCurrentGameState(), pick(['currentVideo', 'found']))(state),
	actionCreators,
)(({ config: { videos }, currentVideo, found, nextVideo, foundAnswer, showAnswers, playPause }) => <section>
	<button onClick={() => nextVideo()}>Next video</button>
	<button onClick={() => playPause()}>Afspelen / Pauze</button>
	<button onClick={() => showAnswers()}>Toon antwoorden</button>
	{videos[currentVideo].answers.map(answer =>
		<button css={{ display: 'block' }} key={answer} disabled={found[answer] || false} onClick={() => foundAnswer(answer)}>{answer}</button>
	)}
</section>)

export const Viewport = connect(
	state => pipe(getCurrentGameState(), pick(['currentVideo', 'playing', 'found', 'answersVisible']))(state),
)(({ config: { videos }, currentVideo, playing, found, answersVisible }) => {
	const { answers, videoUrl, vertical } = videos[currentVideo]

	console.log(videoUrl, answers)

	return <article css={css`
		flex: 1;
	`}>
		<VideoPlayer
			videoUrl={videoUrl}
			vertical={vertical}
			playing={playing}
			answers={answers.map((answer, i) => ({ name: answer, points: (i + 1) * 10 }))}
			found={found}
			answersVisible={answersVisible}
		/>
	</article>
})
