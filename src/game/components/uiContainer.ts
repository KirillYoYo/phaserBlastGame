import Phaser from 'phaser'

export abstract class UIContainer extends Phaser.GameObjects.Container {
    protected bg?: Phaser.GameObjects.Rectangle

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number,
        bgColor: number = 0x000000
    ) {
        super(scene, x, y)
        this.setSize(width, height)

        this.bg = scene.add
            .rectangle(0, 0, width, height, bgColor)
            .setOrigin(0)
            .setStrokeStyle(1, 0xffffff, 0.1) // тонкая рамка для отладки
        this.add(this.bg)

        scene.add.existing(this)
    }
}