/** @jsx jsx */
/** @jsxFrag React.Fragment */

import React, { useState } from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import './App.css'
import Window from './Window'
import marked from 'marked'
import { applySpec } from 'ramda'
import * as actionCreators from '../state/action-creators'
import { getCurrentGame, getCurrentGameConfig, getPlayState, getScores, getCurrentPlayer } from '../state/selectors'

export default connect(
	applySpec({
		playState: getPlayState(),
		game: getCurrentGame(),
		gameConfig: getCurrentGameConfig(),
		currentPlayer: getCurrentPlayer(),
		scores: getScores(),
	}),
	actionCreators,
)(({ game, gameConfig, playState, currentPlayer, scores, nextGame, startGame }) => <>
	<Window>
		{
			playState === 'DESCRIPTION'
			? <div css={css`
				height: 100vh;
				background-color: lightgrey;
				flex-direction: column;
				padding: 201px 244px;
				font-family: Roboto;
			`}>
				<h1 css={css`
					margin-top: 0px;
					margin-bottom: 88px;
					font-size: 48px;
					line-height: 56px;
				`}>{game.info.name}</h1>
				<div css={css`
					font-size: 24px;
					line-height: 32px;

					> p {
						margin-top: 48px;
						margin-bottom: 48px;
					}
				`} dangerouslySetInnerHTML={{__html: marked(game.info.description)}} />
			</div>
			: <div css={css`
				height: 100vh;
				padding: 80px 122px;
			`}>
				<h1 css={css`
					display: block;
					font-size: 24px;
					line-height: 28px;
					position: absolute;
					left: 122px;
					top: 98px;
				`}>{game.info.name}</h1>
				<game.components.Viewport config={gameConfig} />
				<div css={css`
					width: 100%;
					height: 100px;
					position: absolute;
					left: 0px;
					bottom: 0px;
					display: flex;
				`}>
					{scores.map((score, i) => <div key={i} css={css`
						flex: 1;
						display: flex;
						justify-content: center;
						align-items: center;

						background-color: ${i === currentPlayer ? 'papayawhip' : 'white'};
					`}>{score}</div>)}
				</div>
			</div>
		}
	</Window>
	<div>
	{
		playState === 'DESCRIPTION'
		? <button onClick={() => startGame()}>Start spel</button>
		: <button onClick={() => nextGame()}>Volgend spel</button>
	}
	</div>
	{
		playState === 'DESCRIPTION'
		? <p>Not started yet</p>
		: <game.components.ControlPad config={gameConfig} />
	}
</>)
