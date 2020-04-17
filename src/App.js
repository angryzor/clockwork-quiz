/** @jsx jsx */
/** @jsxFrag React.Fragment */

import React, { useState } from 'react'
import { getGame } from './games'
import { jsx, css } from '@emotion/core'
import config from './config.json'
import './App.css'
import Window from './Window'
import marked from 'marked'

const currentGame = ({ gameIndex }) => getGame(config.games[gameIndex].type)
const currentGameConfig = ({ gameIndex }) => config.games[gameIndex].config

const nextState = appState => {
  if (appState.state === 'PLAYING') {
    return { gameIndex: appState.gameIndex + 1, state: 'DESCRIPTION' }
  } else {
    return { gameIndex: appState.gameIndex, state: 'PLAYING', gameState: currentGame(appState).initialState(currentGameConfig(appState).config) }
  }
}

export default () => {
  const [appState, updateAppState] = useState({ gameIndex: 0, state: 'DESCRIPTION' })
  const Game = currentGame(appState)
  const gameConfig = currentGameConfig(appState)

  return <>
    <Window>
      {
        appState.state === 'DESCRIPTION'
        ? <div css={css`
          display: flex;
          height: 100vh;
          background-color: lightgrey;
          flex-direction: column;
          padding: 200px;
          font-family: Roboto;
        `}>
          <h1>{Game.name}</h1>
          <div dangerouslySetInnerHTML={{__html: marked(Game.description)}} />
        </div>
        : <div css={css`
          display: flex;
          height: 100vh;
          flex-direction: column;
        `}>
          <h1 css={css`
            display: block;
          `}>{Game.name}</h1>
          <Game.Viewport config={gameConfig} gameState={appState.gameState} />
        </div>
      }
    </Window>
    <div>
      <button onClick={() => updateAppState(nextState(appState))}>Verder</button>
    </div>
    <Game.ControlPad
      config={gameConfig}
      gameState={appState.gameState}
      updateGameState={gameState => updateAppState({ ...appState, gameState })}
    />
  </>
}