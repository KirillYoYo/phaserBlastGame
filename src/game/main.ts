import { Game } from 'phaser'
import { enableMapSet } from 'immer'

import { config } from './state/store'

enableMapSet()

const StartGame = (parent: string | HTMLElement) => {
    return new Game({ ...config, parent })
}

export default StartGame
