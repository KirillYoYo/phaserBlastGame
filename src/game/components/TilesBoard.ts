import { gameStore } from '@/game/state/store'
import { GameState } from '@/game/state/state'
import { exponentialGrowth } from '@/game/helpers/animations'

import { COLORS_INT, TileView, TileViewFactory } from '../views/TileView'

export class TilesBoard extends Phaser.GameObjects.Container {
    views = new Map<number, TileView>()
    factory: TileViewFactory
    store: GameState
    fx: Record<string, Phaser.GameObjects.Particles.ParticleEmitter>

    constructor(scene: Phaser.Scene, x: number = 0, y: number = 0) {
        super(scene, x, y)
        scene.add.existing(this)
        this.tileClickHandler = this.tileClickHandler.bind(this)
        this.factory = new TileViewFactory(scene)
        this.store = gameStore.getState()

        gameStore.subscribe((state, prevState) => {
            this.sync(state, prevState)
        })

        this.createFx(0, y)
    }

    create() {
        this.render()
    }

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

    sync(state: GameState, prevState: GameState) {
        for (const id of state.deletedTiles) {
            const count = exponentialGrowth(state.deletedTiles.length, 3)
            this.scene.cameras.main.shake(100 * (count / 7), 0.0005 * count, true)
            const item = prevState.tilesById.get(id)
            if (item) {
                const em = this.fx[item.color]
                em.explode(count * 10, item.x * 64, item.y * 64)
            }
            this.views.get(id)?.destroy()
            this.views.delete(id)
        }
        for (const tile of state.tilesById.values()) {
            let view = this.views.get(tile.id)

            if (!view) {
                view = this.factory.create(tile, this, this.tileClickHandler)
                this.views.set(tile.id, view)
            }

            view.update(tile)
        }
    }

    createFx(x: number, y: number = 0) {
        const gfx = this.scene.add.graphics()
        gfx.fillStyle(0xffffff, 1.0)
        gfx.fillCircle(8, 8, 8)
        gfx.generateTexture('circle', 16, 16)
        gfx.destroy()

        const createEmit = (name: string, x: number, y: number, color: number) => {
            console.log('color', color)
            const gfx = this.scene.add.graphics()
            gfx.fillStyle(color, 1.0)
            gfx.fillRect(8, 8, 8, 8)
            gfx.generateTexture('circle', 16, 16)
            gfx.destroy()
            return this.scene.add.particles(0, y, 'circle', {
                speed: { min: 200, max: 300 },
                lifespan: 1000,
                scale: { start: 0.9, end: 0 },
                alpha: { start: 1, end: 0.2 },
                blendMode: Phaser.BlendModes.ADD,
                quantity: 30,
                frequency: -1,
                tint: color,
            })
        }
        this.fx = {
            red: createEmit('red', x, y, COLORS_INT.red),
            green: createEmit('green', x, y, COLORS_INT.green),
            blue: createEmit('blue', x, y, COLORS_INT.blue),
            purpure: createEmit('purpure', x, y, COLORS_INT.purple),
            yellow: createEmit('yellow', x, y, COLORS_INT.yellow),
        }
    }
}