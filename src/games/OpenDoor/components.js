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
	state => pipe(getCurrentGameState(), pick(['selected', 'found']))(state),
	actionCreators,
)(({ config: { videos }, selected, found, playPause, chooseVideo, backToSelection, showAnswers, foundAnswer }) => <div>
	{selected == null
	? <ul>
		{videos.map((video, i) => <li key={i} onClick={() => chooseVideo(video)}>{video.name}</li>)}
	</ul>
	: <>
		<button onClick={() => playPause()}>Afspelen / Pauze</button>
		<button onClick={() => showAnswers()}>Toon antwoorden</button>
		<button onClick={() => backToSelection()}>Terug naar selectie</button>
		{selected.answers.map(answer =>
			<button css={{ display: 'block' }} key={answer} disabled={found[answer] || false} onClick={() => foundAnswer(answer)}>{answer}</button>
		)}
	</>}
</div>)

export const Viewport = connect(
	state => pipe(getCurrentGameState(), pick(['selected', 'picked', 'playing', 'found', 'answersVisible']))(state),
)(({ config: { videos }, selected, picked, playing, found, answersVisible }) => <article css={css`
	width: 100%;
	height: 100%;
`}>
	{selected == null
	? <div css={css`
		width: 100%;
		height: 100%;
		padding: 104px 0px;
		display: grid;
		grid-template: "video-0 video-1 video-2" 1fr
							"video-0 video-1 video-3" 1fr
							/ 2fr 2fr 3fr;
		gap: 24px;
	`}>
		{videos.map((video, i) =>
			<div key={i} css={css`
				grid-area: video-${i};
				position: relative;
			`}>
				<video autoPlay loop muted css={css`
					width: 100%;
					height: 100%;
					object-fit: cover;
					${picked[video.name] ? { visibility: 'hidden' } : {}}
				`}>
					<source src={video.videoUrl} type="video/mp4" />
				</video>
			</div>)}
	</div>
	: <VideoPlayer
		videoUrl={selected.videoUrl}
		vertical={selected.vertical}
		playing={playing}
		answers={selected.answers.map((answer, i) => ({ name: answer, points: 20 }))}
		found={found}
		answersVisible={answersVisible}
	/>}
</article>)
