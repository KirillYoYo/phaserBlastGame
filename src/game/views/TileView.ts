import { Tile } from '../entities/Tile'

const COLORS = {
    red: hexToTint('#c60f0f'),
    green: hexToTint('#1a9c14'),
    blue: hexToTint('#142b9c'),
    yellow: hexToTint('#bac60fff'),
} as const

console.log("Phaser.Display.Color.HexStringToColor('#BAC60FFF')", COLORS)

export class TileView {
    sprite: Phaser.GameObjects.Sprite

    constructor(scene: Phaser.Scene, tile: Tile, clickClb: (tile: Tile) => void) {
        this.sprite = scene.add.sprite(tile.x * 64, tile.y * 64, 'tile').setInteractive()
        this.sprite.setTintFill(COLORS[tile.color])
        this.sprite.setOrigin(0)
        this.sprite.on('pointerdown', function () {
            clickClb(tile)
        })
    }

    update(tile: Tile) {
        this.sprite.setPosition(tile.x * 64, tile.y * 64)
    }

    destroy() {
        this.sprite.destroy()
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
