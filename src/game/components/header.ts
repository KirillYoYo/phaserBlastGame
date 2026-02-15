import { UIContainer } from '@/game/components/uiContainer'

export class Header extends UIContainer {
    private title: Phaser.GameObjects.Text

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
        super(scene, x, y, width, height, 0x2c3e50)
        this.init()
    }

    private init(): void {
        this.title = this.scene.add.text(this.width / 2, this.height / 2, 'HEADER', {
            fontSize: '24px',
            color: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold',
        })
        this.title.setOrigin(0.5)
        this.add(this.title)
    }

    public setTitle(text: string | number): this {
        this.title.setText(`${text}`)
        return this
    }
}