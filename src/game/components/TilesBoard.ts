import { createInitialState } from '../state/createInitialState'
import { handleTileClick } from '../systems/ClickSystem'
import { TileView, TileViewFactory } from '../views/TileView'
import { applyGravity } from '../systems/GravitySystem'
import { refill } from '../systems/RefillSystem'
import { GameState } from '../state/state'
import { config } from '../main'

export class TilesBoard extends Phaser.GameObjects.Container {
    tileState!: GameState
    views = new Map<number, TileView>()
    factory: TileViewFactory

    constructor(scene: Phaser.Scene, x: number = 0, y: number = 0) {
        super(scene, x, y)
        scene.add.existing(this)
        this.tileClickHandler = this.tileClickHandler.bind(this)
        this.factory = new TileViewFactory(scene)
    }

    create() {
        this.tileState = createInitialState(config.game.cols, config.game.rows)
        this.render()
    }

    /**
     * render
     * */

    render() {
        for (const row of this.tileState.grid) {
            for (const tile of row) {
                if (!tile) {
                    continue
                }
                let view = this.views.get(tile?.id)
                if (!view) {
                    view = this.factory.create(tile, this, this.tileClickHandler)
                    this.views.set(tile.id, view)
                }
                // todo обновляются все тайлы!
                view?.update(tile)
            }
        }
    }

    tileClickHandler(tileId: number) {
        const tile = this.tileState.tilesById.get(tileId)
        this.tileState = handleTileClick(this.tileState, tile!.x, tile!.y)
        /**/
        this.tileState.deletedTiles.forEach(id => this.views.get(id)?.destroy())
        this.tileState = {
            ...this.tileState,
            deletedTiles: [],
        }
        /**/
        this.tileState = applyGravity(this.tileState)
        this.tileState = refill(this.tileState)
        this.render()
    }

    // update(time: number, delta: number) {
    //
    // }
}
