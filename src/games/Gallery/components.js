/** @jsx jsx */
/** @jsxFrag React.Fragment */

import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'
import * as actionCreators from './action-creators'

export const ControlPad = ({ gameState, updateGameState }) => <section>
	<button onClick={() => { const [current, ...remaining] = gameState.remaining; updateGameState({ ...gameState, current, remaining })}}>Correct</button>
	<button onClick={() => { const [current, ...remaining] = gameState.remaining; updateGameState({ ...gameState, current, remaining, passed: [...gameState.passed, current] })}}>Pas</button>
</section>

export const Viewport = ({ gameState: { current, } }) =>
