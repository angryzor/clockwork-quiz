/** @jsx jsx */
/** @jsxFrag React.Fragment */

import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import * as actionCreators from './action-creators'
import { pipe, pick } from 'ramda'
import { getCurrentGameState } from '../../state/selectors'

export const ControlPad = connect(
	state => pipe(getCurrentGameState(), pick(['selected', 'found']))(state),
	actionCreators,
)(({ config: { videos }, selected, found, playPause, chooseVideo, backToSelection, showAnswers, toggleAnswer }) => <div>
	{selected == null
	? <ul>
		{videos.map((video, i) => <li key={i} onClick={() => chooseVideo(video)}>{video.name}</li>)}
	</ul>
	: <>
		<button onClick={() => playPause()}>Afspelen / Pauze</button>
		<button onClick={() => showAnswers()}>Toon antwoorden</button>
		<button onClick={() => backToSelection()}>Terug naar selectie</button>
		{selected.answers.map(answer =>
			<label key={answer} css={{ display: 'block' }}><input
				type="checkbox"
				value={found[answer] || false}
				onChange={event => toggleAnswer(answer, event.target.checked)}
			/>{answer}</label>
		)}
	</>}
</div>)

export const Viewport = connect(
	state => pipe(getCurrentGameState(), pick(['selected', 'picked', 'playing', 'found', 'answersVisible']))(state),
)(({ config: { videos }, selected, picked, playing, found, answersVisible }) => {
	const videoRef = useRef()
	useEffect(() => {
		if (selected != null && videoRef.current != null) {
			if (playing) {
				videoRef.current.play()
			} else {
				videoRef.current.pause()
			}
		}
	})

	return <article css={css`
		flex: 1;
		display: flex;
		flex-direction: column;
		position: relative;
		padding: 64px;
	`}>
		{selected == null
		? <div css={css`
			width: 100%;
			height: 100%;
			display: grid;
			grid-template: "video-0 video-1 video-2" 1fr
								"video-0 video-1 video-3" 1fr
								/ 2fr 2fr 3fr;
			gap: 32px;
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
		: <div css={css`
			width: 100%;
			height: 100%;
			display: flex;
		`}>
			<div css={css`
				position: relative;
				flex: 1;
			`}>
				<video controls ref={videoRef} css={css`
					width: 100%;
					height: 100%;
					object-fit: contain;
				`}>
					<source src={selected.videoUrl} type="video/mp4" />
				</video>
			</div>
			<div css={css`
				transition-property: width;
				transition-duration: 0.4s;
				width: ${answersVisible ? 300 : 0}px;
				display: flex;
				align-items: center;
				justify-content: center;
				overflow: hidden;
			`}>
				<ul>
					{selected.answers.map(answer =>
						<li css={css`
							list-style: none;
							font-weight: 700;
							margin: 1em;

							transition-property: filter;
							transition-duration: 0.6s;

							${found[answer] ? {} : css`
								filter: blur(5px);
							`}
						`}>
							{answer}
						</li>
					)}
				</ul>
			</div>
		</div>}
	</article>
})
