/** @jsx jsx */
/** @jsxFrag React.Fragment */

import React from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import Window from './Window'
import marked from 'marked'
import { applySpec } from 'ramda'
import * as actionCreators from '../state/action-creators'
import { getCurrentGame, getCurrentGameConfig, getPlayState, getTeams, getCurrentPlayer } from '../state/selectors'

export default connect(
	applySpec({
		playState: getPlayState(),
		game: getCurrentGame(),
		gameConfig: getCurrentGameConfig(),
		currentPlayer: getCurrentPlayer(),
		teams: getTeams(),
	}),
	actionCreators,
)(({ game, gameConfig, playState, currentPlayer, teams, nextGame, startGame }) => <>
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
					{teams.map((team, i) => <div key={team.name} css={css`
						flex: 1;
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;

						background-color: ${team.name === currentPlayer ? 'rgba(253, 230, 210)' : 'white'};
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
