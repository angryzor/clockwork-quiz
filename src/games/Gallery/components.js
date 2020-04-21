/** @jsx jsx */
/** @jsxFrag React.Fragment */

import React from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import * as actionCreators from './action-creators'
import { pipe, pick } from 'ramda'
import { getCurrentGameState } from '../../state/selectors'

export const ControlPad = connect(
	null,
	actionCreators,
)(({ nextSet, nextPicture }) => <section>
	<button onClick={() => nextSet()}>Next set</button>
	<button onClick={() => nextPicture()}>Next picture</button>
</section>)

export const Viewport = connect(
	state => pipe(getCurrentGameState(), pick(['currentSet', 'currentImage']))(state),
)(({ config, currentSet, currentImage }) => <section css={css`
	width: 100%;
	height: 100%;
	padding: 104px 122px;
`}>
	<img
		src={config.sets[currentSet][currentImage]}
		alt="Question"
		css={css`
			width: 100%;
			height: 100%;
			object-fit: contain;
		`}
	/>
</section>)
