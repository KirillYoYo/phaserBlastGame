import { gameStore } from '@/game/state/store'
import { GameState } from '@/game/state/state'

import { TileView, TileViewFactory } from '../views/TileView'

export class TilesBoard extends Phaser.GameObjects.Container {
    views = new Map<number, TileView>()
    factory: TileViewFactory

    constructor(scene: Phaser.Scene, x: number = 0, y: number = 0) {
        super(scene, x, y)
        scene.add.existing(this)
        this.tileClickHandler = this.tileClickHandler.bind(this)
        this.factory = new TileViewFactory(scene)

        gameStore.subscribe(state => {
            this.sync(state)
        })
    }

    create() {
        // this.tileState = createInitialState(config.game.cols, config.game.rows)
        this.render()
    }

    /**
     * render
     * */

    render() {
        for (const row of gameStore.getState().grid) {
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
        gameStore.dispatch({
            type: 'TILE_CLICKED',
            tileId,
        })
    }

    // update(time: number, delta: number) {
    //
    // }

    sync(state: GameState) {
        for (const id of state.deletedTiles) {
            this.views.get(id)?.destroy()
            this.views.delete(id)
        }

        // 2. update / create views
        for (const tile of state.tilesById.values()) {
            let view = this.views.get(tile.id)

            if (!view) {
                view = this.factory.create(tile, this, this.tileClickHandler)
                this.views.set(tile.id, view)
            }

            view.update(tile)
        }
    }
}
