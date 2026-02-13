import { config } from '../state/store'
import { Tile } from '../entities/Tile'

export const COLORS_INT = {
    red: hexToTint('#CB1B2E'),
    purpure: hexToTint('#C04D9B'),
    green: hexToTint('#44C125'),
    blue: hexToTint('#00A4EF'),
    yellow: hexToTint('#F19E00'),
} as const

export class TileView {
    sprite: Phaser.GameObjects.Sprite
    parent: Phaser.GameObjects.Container
    private scene: Phaser.Scene
    id: string

    private constructor(
        scene: Phaser.Scene,
        tile: Tile,
        parent: Phaser.GameObjects.Container,
        clickClb: (tileId: number) => void
    ) {
        this.scene = scene
        this.sprite = scene.add
            .sprite(tile.x * 64, -(config.game.rows - -tile.y) * 64, `b_${tile.color}`)
            .setInteractive()

        this.sprite.setOrigin(0)
        this.sprite.on('pointerdown', () => {
            clickClb(tile.id)
        })
        this.sprite.setDisplaySize(62, 62)
        this.sprite.setName(`${tile.id}`)
        this.id = `${tile.id}`
        this.parent = parent
        parent.add(this.sprite)

        scene.tweens.add({
            targets: this.sprite,
            x: tile.x * 64,
            y: tile.y * 64,
            duration: 300,
            ease: 'Back.easeOut', // Пружинистый эффект
        })
    }

    update(tile: Tile) {
        this.scene.tweens.add({
            targets: this.sprite,
            x: tile.x * 64,
            y: tile.y * 64,
            duration: 300, // 0.3 секунды
            ease: 'Power2',
        })
    }

    destroy() {
        this.sprite.destroy()
    }

    static create(
        scene: Phaser.Scene,
        tile: Tile,
        parent: Phaser.GameObjects.Container,
        clickClb: (tileId: number) => void
    ): TileView {
        return new TileView(scene, tile, parent, clickClb)
    }
}

function hexToTint(hex: string) {
    const rgb = hex.slice(0, 7)
    return Phaser.Display.Color.HexStringToColor(rgb).color
}

export class TileViewFactory {
    constructor(private scene: Phaser.Scene) {}

    create(
        tile: Tile,
        parent: Phaser.GameObjects.Container,
        clickClb: (tileId: number) => void
    ): TileView {
        return TileView.create(this.scene, tile, parent, clickClb)
    }
}

// function hexAlpha(hex: string) {
//     if (hex.length === 9) {
//         return parseInt(hex.slice(7, 9), 16) / 255
//     }
//     return 1
// }