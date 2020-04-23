/** @jsx jsx */

import { connect } from 'react-redux'
import { css, jsx } from '@emotion/core'
import { pipe, pick } from 'ramda'
import * as actionCreators from './action-creators'
import { getCurrentGameState } from '../../state/selectors'

const colors = [
	'#F58220',
	'#3DA4BF',
	'#58595B',
]

const bgColors = [
	'rgb(253, 230, 210)',
	'rgb(216, 246, 232)',
	'rgb(225, 225, 225)',
]

const Context = ({ text, disabled, color }) => <section css={css`
	width: 244px;
	height: 84px;
	display: flex;
	justify-content: center;
	align-items: center;

	transition-property: background-color;
	transition-duration: 0.6s;

	border: solid 12px white;

	background-color: ${disabled ? 'white' : color};

	font-size: 24px;
	line-height: 28px;
`}>
	<p>{text}</p>
</section>

export const ControlPad = connect(
	state => pipe(getCurrentGameState(), pick(['found', 'phase', 'currentPuzzle']))(state),
	actionCreators,
)(({ config: { puzzles }, currentPuzzle, found, phase, start, stop, nextRound, foundAnswer }) => {
	switch (phase) {
		case 'PLAYER_PREPARATION':
			return <button onClick={() => start()}>START</button>
		case 'THINKING':
			return <div>
				<button onClick={() => stop()}>STOP</button>
				{puzzles[currentPuzzle].answers.map(({ name }) =>
					<button css={{ display: 'block' }} key={name} disabled={found[name] || false} onClick={() => foundAnswer(name)}>{name}</button>
				)}
			</div>
		case 'POSTROUND':
			return <button onClick={() => nextRound()}>Volgende ronde</button>
		// no default
	}
})

export const Viewport = connect(
	state => pipe(getCurrentGameState(), pick(['found', 'contexts', 'currentPuzzle']))(state),
)(({ config: { puzzles }, found, contexts, currentPuzzle }) => <article css={css`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: row;
	padding: 122px;
`}>
	<div css={css`
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	`}>
		<div css={css`
			grid-template-columns: repeat(3, 1fr);
			gap: 1px;
			display: grid;
			background-color: lightgrey;
			box-shadow: inset 0 0 0 12px white;
		`}>
			{contexts.map(({ answer, text, colorIndex }) => <Context key={text} text={text} color={bgColors[colorIndex]} disabled={!found[answer]} />)}
		</div>
	</div>
	<div css={css`
		width: 300px;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	`}>
		<ul>
			{puzzles[currentPuzzle].answers.filter(({ name }) => found[name] || false).map(({ name }, i) =>
				<li key={name} css={css`
					list-style: none;
					margin: 1em;

					display: flex;
					flex-direction: row;
					align-items: center;
				`}>
					<div css={css`
						padding-right: 1em;
						font-size: 20px;
						line-height: 28px;
					`}>20</div>
					<div css={css`
						flex: 1;
						font-weight: 700;
						font-size: 32px;
						line-height: 28px;

						color: ${colors[i]};
					`}>{name}</div>
				</li>
			)}
		</ul>
	</div>
</article>)
