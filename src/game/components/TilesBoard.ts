import { GameState } from '@/game/state/state'
import { exponentialGrowth } from '@/game/helpers/animations'
import { Tile, TileColor } from '@/game/entities/Tile'
import { store } from '@/game/state/store'
import { tileClicked } from '@/game/state/gameSlice'

import { COLORS_INT, TileView, TileViewFactory } from '../views/TileView'

export class TilesBoard extends Phaser.GameObjects.Container {
    views = new Map<number, TileView>()
    factory: TileViewFactory
    store: GameState
    fx: Record<string, Phaser.GameObjects.Particles.ParticleEmitter>
    private _clickedTile: number
    private prevState: GameState

    constructor(scene: Phaser.Scene, x: number = 0, y: number = 0) {
        super(scene, x, y)
        scene.add.existing(this)
        this.tileClickHandler = this.tileClickHandler.bind(this)
        this.factory = new TileViewFactory(scene)
        this.store = store.getState().game
        this.prevState = store.getState().game
        store.subscribe(() => {
            const currentState = store.getState().game
            if (currentState !== this.prevState) {
                this.sync(currentState)

                this.prevState = currentState
            }
        })

        this.createFx(0, y)
    }

    create() {
        this.render()
    }

    render() {
        for (const row of store.getState().game.grid) {
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
                view?.update(tile, this.store.boosters.teleportFirst)
            }
        }
    }

    tileClickHandler(tileId: number) {
        this._clickedTile = tileId
        store.dispatch(tileClicked(tileId))
    }

    sync(state: GameState) {
        this.store = state
        if (state.deletedTiles.length) {
            this.playTileFx(
                state.deletedTiles.map(id => this.prevState.tilesById.get(id)) as Tile[]
            )
        }
        for (const id of state.deletedTiles) {
            const count = exponentialGrowth(state.deletedTiles.length, 3)
            const shake = Math.min(1500, 100 * (count / 7))
            const power = Math.min(0.02, 0.0005 * count)
            this.scene.cameras.main.shake(shake, power, true)
            const item = this.prevState.tilesById.get(id)
            if (item) {
                const em = this.fx[item.color]
                em.explode(count * 2, item.x * 64, item.y * 64)
            }
            this.views.get(id)?.destroy()
            this.views.delete(id)
        }
        for (const tile of state.tilesById.values()) {
            let view = this.views.get(tile.id)

            if (!view) {
                view = this.factory.create(
                    tile,
                    this,
                    this.tileClickHandler,
                    this.store.boosters.teleportFirst
                )
                this.views.set(tile.id, view)
            }

            view.update(tile, this.store.boosters.teleportFirst)
        }
    }

    createFx(x: number, y: number = 0) {
        const gfx = this.scene.add.graphics()
        gfx.fillStyle(0xffffff, 1.0)
        gfx.fillCircle(8, 8, 8)
        gfx.generateTexture('circle', 16, 16)
        gfx.destroy()

        const createEmit = (name: string, x: number, y: number, color: number) => {
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
            purpure: createEmit('purpure', x, y, COLORS_INT.purpure),
            yellow: createEmit('yellow', x, y, COLORS_INT.yellow),
        }
    }

    playTileFx(tiles: Tile[]) {
        const circles: Phaser.GameObjects.Image[] = []
        const tile = tiles.find(tile => tile.id === this._clickedTile)
        if (!tile) {
            return
        }
        const intensity = exponentialGrowth(tiles.length, 10)
        const radius = 2 + intensity * 0.55

        // ---- СОЗДАНИЕ N ЧАСТИЦ ----
        for (let i = 0; i < intensity * 2; i++) {
            const circle = this.scene.add.image(
                this.x + tile.x * 64,
                this.scene.children.list[0].height + tile.y * 64, // высота header
                'circle'
            )
            circle.setDisplaySize(radius, radius)

            circle.setTintFill(COLORS_INT[tile!.color as TileColor])

            // circle.setBlendMode(Phaser.BlendModes.ADD)

            circles.push(circle)

            // ФАЗА 1 — быстрое появление
            this.scene.tweens.add({
                targets: circle,
                scale: Phaser.Math.FloatBetween(0.6, 1),
                duration: 0,
                ease: 'Back.Out',
            })
        }

        // ---- ФАЗА 2 — разлёт ----
        this.scene.time.delayedCall(50, () => {
            circles.forEach(circle => {
                const angle = Phaser.Math.FloatBetween(0, Math.PI * 2)
                const distance = Phaser.Math.Between(
                    60,
                    Math.min(this.scene.cameras.main.width * 8, 20 + 40 * intensity * Math.random())
                )

                const dx = Math.cos(angle) * distance
                const dy = Math.sin(angle) * distance

                this.scene.tweens.add({
                    targets: circle,
                    x: this.x + tile.x * 64 + dx,
                    y: this.scene.children.list[0].height + tile.y * 64 + dy,
                    duration: 250 + intensity * 10,
                    ease: 'Cubic.Out',
                })
            })
        })

        // ---- ФАЗА 3 — сбор ----
        this.scene.time.delayedCall(250, () => {
            circles.forEach(circle => {
                this.scene.tweens.add({
                    targets: circle,
                    x: this.parentContainer.width / 2,
                    y: this.scene.children.list[0].height / 2,
                    scale: 0.8,
                    duration: 300 + Math.min(600, intensity * 10),
                    ease: 'Cubic.In',
                    onComplete: () => circle.destroy(),
                })
            })
        })
    }
}