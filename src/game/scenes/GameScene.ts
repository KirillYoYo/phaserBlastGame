import { Tile } from '@/game/entities/Tile'

import { createInitialState } from '../state/createInitialState'
import { handleTileClick } from '../systems/ClickSystem'
import { TileView } from '../views/TileView'
import { applyGravity } from '../systems/GravitySystem'
import { refill } from '../systems/RefillSystem'
import { GameState } from '../state/state'

export class GameScene extends Phaser.Scene {
    state!: GameState
    views = new Map<number, TileView>()

    constructor() {
        super('GameScene')

        this.tileClickHandler = this.tileClickHandler.bind(this)
    }

    create() {
        this.state = createInitialState(8, 8)
        this.render()
    }

    /**
     * render
     * */

    render() {
        for (const row of this.state.grid) {
            for (const tile of row) {
                if (!tile) continue

                let view = this.views.get(tile.id)
                if (!view) {
                    view = new TileView(this, tile, this.tileClickHandler)
                    this.views.set(tile.id, view)
                }
                view.update(tile)
            }
        }
    }

    tileClickHandler(tile: Tile) {
        this.state = handleTileClick(this.state, tile.x, tile.y)
        this.state = applyGravity(this.state)
        this.state = refill(this.state)
        this.render()
    }

    // update(time: number, delta: number) {
    //
    // }
}
