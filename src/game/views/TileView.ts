import { Tile } from '../entities/Tile'

export class TileView {
    sprite: Phaser.GameObjects.Sprite

    constructor(scene: Phaser.Scene, tile: Tile) {
        this.sprite = scene.add.sprite(tile.x * 64, tile.y * 64, tile.color)
        this.sprite.setOrigin(0)
    }

    update(tile: Tile) {
        this.sprite.setPosition(tile.x * 64, tile.y * 64)
    }

    destroy() {
        this.sprite.destroy()
    }
}
