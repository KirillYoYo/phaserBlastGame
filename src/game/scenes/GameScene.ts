import { createInitialState } from '../state/createInitialState'
import { handleTileClick } from '../systems/ClickSystem'
import { TileView, TileViewFactory } from '../views/TileView'
import { applyGravity } from '../systems/GravitySystem'
import { refill } from '../systems/RefillSystem'
import { GameState } from '../state/state'

export class GameScene extends Phaser.Scene {
    state!: GameState
    views = new Map<number, TileView>()
    factory: TileViewFactory

    constructor() {
        super('GameScene')
        this.tileClickHandler = this.tileClickHandler.bind(this)
        this.factory = new TileViewFactory(this)
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
                if (!tile) {
                    continue
                }
                let view = this.views.get(tile?.id)
                if (!view) {
                    view = this.factory.create(tile, this.tileClickHandler)
                }
                // todo обновляются все тайлы!
                view?.update(tile)
                this.views.set(tile.id, view)
            }
        }
    }

    tileClickHandler(tileId: number) {
        const tile = this.state.tilesById.get(tileId)
        this.state = handleTileClick(this.state, tile!.x, tile!.y)
        /**/
        this.state.deletedTiles.forEach(id => this.views.get(id)?.destroy())
        this.state = {
            ...this.state,
            deletedTiles: [],
        }
        /**/
        this.state = applyGravity(this.state)
        this.state = refill(this.state)
        this.render()
    }

    // update(time: number, delta: number) {
    //
    // }
}
