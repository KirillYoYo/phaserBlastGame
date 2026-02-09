import { AUTO, Game } from 'phaser'
import { enableMapSet } from 'immer'

import { Boot } from './scenes/Boot'
import { GameScene as MainGame } from './scenes/GameScene'
import { GameOver } from './scenes/GameOver.js'
import { Preloader } from './scenes/Preloader.js'

enableMapSet()

const config = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scale: {
        /* mode: Phaser.Scale.RESIZE, */
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [Boot, Preloader, MainGame, GameOver],
}

const StartGame = (parent: string | HTMLElement) => {
    return new Game({ ...config, parent })
}

export default StartGame
