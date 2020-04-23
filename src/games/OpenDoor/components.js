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
	state => pipe(getCurrentGameState(), pick(['selected', 'found', 'phase', 'picked']))(state),
	actionCreators,
)(({ config: { videos }, phase, selected, found, playPause, chooseVideo, backToSelection, showAnswers, foundAnswer, start, stop, picked }) => {
	switch (phase) {
		case 'PREROUND':
			return <div>
				{videos.map((video, i) =>
					<button css={{ display: 'block' }} key={video.name} disabled={picked[video.name] || false} onClick={() => chooseVideo(video)}>{video.name}</button>
				)}
			</div>
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
				{selected.answers.map(answer =>
					<button css={{ display: 'block' }} key={answer} disabled={found[answer] || false} onClick={() => foundAnswer(answer)}>{answer}</button>
				)}
			</div>
		case 'POSTROUND':
			return <button onClick={() => backToSelection()}>Terug naar selectie</button>
		// no default
	}
})

export const Viewport = connect(
	state => pipe(getCurrentGameState(), pick(['selected', 'picked', 'playing', 'found', 'phase']))(state),
)(({ config: { videos }, selected, picked, playing, found, phase }) => <article css={css`
	width: 100%;
	height: 100%;
`}>
	{phase === 'PREROUND'
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
					opacity: ${picked[video.name] ? 0.3 : 1};
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
		answersVisible={phase !== 'VIDEO_PLAYING'}
	/>}
</article>)
