import { AUTO } from 'phaser'

import { GameState } from '@/game/state/state'
import { reduce } from '@/game/state/reducers'
import { createInitialState } from '@/game/state/createInitialState'
import { Boot } from '@/game/scenes/Boot'
import { Preloader } from '@/game/scenes/Preloader'
import { GameScene as MainGame } from '@/game/scenes/GameScene'
import { GameOver } from '@/game/scenes/GameOver'

export const config = {
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
    game: { cols: 8, rows: 8 },
}

export type Action = { type: 'TILE_CLICKED'; tileId: number }

class GameStore {
    private state: GameState
    private listeners = new Set<(state: GameState) => void>()

    constructor() {
        this.state = createInitialState(config.game.cols, config.game.rows)
    }

    dispatch(action: Action) {
        const prev = this.state
        const next = reduce(prev, action)

        if (next !== prev) {
            this.state = next
            this.emit()
        }
    }

    getState() {
        return this.state
    }

    subscribe(fn: (state: GameState) => void) {
        this.listeners.add(fn)
        return () => this.listeners.delete(fn)
    }

    private emit() {
        this.listeners.forEach(fn => fn(this.state))
    }
}

export const gameStore = new GameStore()
