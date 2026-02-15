import Phaser from 'phaser'
import { UIContainer } from '@/game/components/uiContainer'

export class Footer extends UIContainer {
    private text: Phaser.GameObjects.Text
    private scoreText?: Phaser.GameObjects.Text
    private timerText?: Phaser.GameObjects.Text

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
        super(scene, x, y, width, height, 0x1a252f)
        this.init()
    }

    private init(): void {
        // this.text = this.scene.add.text(this.width / 2, 20, 'FOOTER', {
        //     fontSize: '20px',
        //     color: '#ffffff',
        //     fontFamily: 'Arial',
        // })
        // this.text.setOrigin(0.5)
        // this.add(this.text)
    }
}