import { createInitialState } from '../state/createInitialState'
import { handleTileClick } from '../systems/ClickSystem'
import { applyGravity } from '../systems/GravitySystem'
import { refill } from '../systems/RefillSystem'
import { TileView } from '../views/TileView'
import { GameState } from '../state/state'

export class GameScene extends Phaser.Scene {
    state!: GameState
    views = new Map<number, TileView>()

    constructor() {
        super('GameScene')
    }

    create() {
        this.state = createInitialState(8, 8)
        this.render()

        this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
            const x = Math.floor(p.x / 64)
            const y = Math.floor(p.y / 64)
            console.log('px', p.x)
            console.log('py', p.y)

            this.state = handleTileClick(this.state, x, y)
            this.state = applyGravity(this.state)
            this.state = refill(this.state)

            this.render()
        })
    }

    render() {
        for (const row of this.state.grid) {
            for (const tile of row) {
                if (!tile) continue

                let view = this.views.get(tile.id)
                if (!view) {
                    view = new TileView(this, tile)
                    this.views.set(tile.id, view)
                }
                view.update(tile)
            }
        }
    }

    // update(time: number, delta: number) {
    //
    // }
}
