/** @jsx jsx */
/** @jsxFrag React.Fragment */

import React, { useRef, useEffect } from 'react'
import { jsx, css } from '@emotion/core'

export default ({ playing, videoUrl, answers, found, answersVisible, vertical = false }) => {
	const videoRef = useRef()

	useEffect(() => {
		if (videoRef.current != null) {
			if (playing) {
				videoRef.current.play()
			} else {
				videoRef.current.pause()
			}
		}
	})

	return <div css={css`
		width: 100%;
		height: 100%;
		display: flex;
	`}>
		<div css={css`
			position: relative;
			flex: 1;
			padding: ${vertical && !answersVisible ? 0 : 104}px ${answersVisible ? 0 : 122}px;
			transition-property: padding;
			transition-duration: 0.4s;
		`}>
			<video key={videoUrl} controls ref={videoRef} css={css`
				width: 100%;
				height: 100%;
				object-fit: contain;
			`}>
				<source src={videoUrl} type="video/mp4" />
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
				{answers.map(({ name, points }) =>
					<li key={name} css={css`
						list-style: none;
						margin: 1em;

						display: flex;
						flex-direction: row;
					`}>
						<div css={css`
							padding-right: 1em;
						`}>{points}</div>
						<div css={css`
							flex: 1;
							font-weight: 700;
							transition-property: filter;
							transition-duration: 0.6s;

							${found[name] ? {} : css`
								filter: blur(5px);
							`}
						`}>{name}</div>
					</li>
				)}
			</ul>
		</div>
	</div>
}