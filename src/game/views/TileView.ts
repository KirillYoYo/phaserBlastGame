import { Tile } from '../entities/Tile'

const COLORS = {
    red: hexToTint('#c60f0f'),
    green: hexToTint('#1a9c14'),
    blue: hexToTint('#142b9c'),
    yellow: hexToTint('#bac60fff'),
} as const

export class TileView {
    sprite: Phaser.GameObjects.Sprite
    private scene: Phaser.Scene

    private constructor(scene: Phaser.Scene, tile: Tile, clickClb: (tileId: number) => void) {
        this.scene = scene
        this.sprite = scene.add.sprite(tile.x * 64, tile.y * 64, 'tile').setInteractive()
        this.sprite.setTintFill(COLORS[tile.color])
        this.sprite.setOrigin(0)
        this.sprite.on('pointerdown', () => clickClb(tile.id))
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

    static create(scene: Phaser.Scene, tile: Tile, clickClb: (tile: Tile) => void): TileView {
        return new TileView(scene, tile, clickClb)
    }
}

function hexToTint(hex: string) {
    const rgb = hex.slice(0, 7)
    return Phaser.Display.Color.HexStringToColor(rgb).color
}

function hexAlpha(hex: string) {
    if (hex.length === 9) {
        return parseInt(hex.slice(7, 9), 16) / 255
    }
    return 1
}

export class TileViewFactory {
    constructor(private scene: Phaser.Scene) {}

    create(tile: Tile, clickClb: (tileId: number) => void): TileView {
        return new TileView(this.scene, tile, clickClb)
    }
}
