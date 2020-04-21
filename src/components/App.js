/** @jsx jsx */
/** @jsxFrag React.Fragment */

import React, { useState } from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import './App.css'
import Window from './Window'
import marked from 'marked'
import { applySpec } from 'ramda'
import { nextStep } from '../state/action-creators'
import { getCurrentGame, getCurrentGameConfig, getPlayState } from '../state/selectors'

export default connect(
	applySpec({
		playState: getPlayState(),
		game: getCurrentGame(),
		gameConfig: getCurrentGameConfig(),
	}),
	{ nextStep },
)(({ game, gameConfig, playState, nextStep }) => <>
	<Window>
		{
			playState === 'DESCRIPTION'
			? <div css={css`
				display: flex;
				height: 100vh;
				background-color: lightgrey;
				flex-direction: column;
				padding: 200px;
				font-family: Roboto;
			`}>
				<h1>{game.info.name}</h1>
				<div dangerouslySetInnerHTML={{__html: marked(game.info.description)}} />
			</div>
			: <div css={css`
				display: flex;
				height: 100vh;
				flex-direction: column;
			`}>
				<h1 css={css`
					display: block;
				`}>{game.name}</h1>
				<game.components.Viewport config={gameConfig} />
			</div>
		}
	</Window>
	<div>
		<button onClick={() => nextStep()}>Verder</button>
	</div>
	{
		playState === 'DESCRIPTION'
		? <p>Not started yet</p>
		: <game.components.ControlPad config={gameConfig} />
	}
</>)
