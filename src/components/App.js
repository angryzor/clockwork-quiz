/** @jsx jsx */
/** @jsxFrag React.Fragment */

import React from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import Window from './Window'
import marked from 'marked'
import { applySpec, sortBy } from 'ramda'
import * as actionCreators from '../state/action-creators'
import { getCurrentGame, getCurrentGameConfig, getPhase, getTeams, getCurrentPlayer } from '../state/selectors'
import config from '../config'

const IngameWindowContent = connect(
	applySpec({
		game: getCurrentGame(),
		gameConfig: getCurrentGameConfig(),
		currentPlayer: getCurrentPlayer(),
		teams: getTeams(),
	}),
)(({ phase, game, gameConfig, currentPlayer, teams }) => {
	switch (phase) {
		case 'DESCRIPTION':
			return <div css={css`
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
		case 'PLAYING':
			return <div css={css`
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
		// no default
	}
})


const WindowContent = connect(
	applySpec({
		phase: getPhase(),
	}),
)(({ phase }) => {
	switch (phase) {
		case 'TITLE_SCREEN':
			return <div css={css`
				height: 100vh;
				background-color: black;
				font-family: Roboto;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
			`}>
				<p css={css`
					font-size: 72px;
					line-height: 84px;
					color: white;
					text-align: center;
					margin-bottom: 0px;
				`}>de <strong>SLIMSTE<br/>CLOCKWORKER</strong> ter wereld</p>
				<p css={css`
					font-size: 56px;
					line-height: 66px;
					color: #58595B;
					text-align: center;
				`}>quiz</p>
			</div>
		case 'POSTGAME_SCREEN':
			return <div css={css`
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
				`}>en het winnende team is...</h1>
				<div css={css`
					font-size: 24px;
					line-height: 32px;

					> p {
						margin-top: 48px;
						margin-bottom: 48px;
					}
				`}>
					<p>Na een geweldige nek-aan-nek race zijn we bij het einde gekomen van dit spel en is het tijd om het winnende team aan te kondigen.</p>
					<p>We willen alle deelnemers bedanken voor het meespelen met de eerste Clockwork Quiz. We hopen dat jullie ervan genoten hebben.</p>
					<p>En dan nu - eindelijk - de winnaars...</p>
				</div>
			</div>
		default:
			return <IngameWindowContent phase={phase} />
	}
})

const GameControlPadContent = connect(
	applySpec({
		game: getCurrentGame(),
		gameConfig: getCurrentGameConfig(),
	}),
)(({ game, gameConfig }) =>
	<game.components.ControlPad config={gameConfig} />
)

const ControlPadContent = connect(
	applySpec({
		phase: getPhase(),
		teams: getTeams(),
	}),
	actionCreators,
)(({ phase, nextGame, startGame, teams }) => {
	switch (phase) {
		case 'TITLE_SCREEN':
			return <button css={{ display: 'block' }} onClick={() => nextGame()}>Start quiz!</button>
		case 'POSTGAME_SCREEN':
			return <ul>
				{sortBy(x => -x.score, teams).map(({ name, score }) => <li>{name}: {score}</li>)}
			</ul>
		case 'DESCRIPTION':
			return <button css={{ display: 'block' }} onClick={() => startGame()}>Start spel</button>
		case 'PLAYING':
			return <>
				{config.debug ? <button css={{ display: 'block' }} onClick={() => nextGame()}>Next Game</button> : null}
				<GameControlPadContent />
			</>
		// no default
	}
})

export default () => <>
	<Window>
		<WindowContent />
	</Window>
	<ControlPadContent />
</>
