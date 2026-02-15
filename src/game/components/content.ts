import Phaser from 'phaser'

import { UIContainer } from '@/game/components/uiContainer'

export class Content extends UIContainer {
    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
        super(scene, x, y, width, height, 0x34495e)
    }

    public centerChild(child: UIContainer, offsetY: number = 0): this {
        if (!child) return this

        const childWidth = child.width || child.getBounds().width
        const childHeight = child.height || child.getBounds().height

        child.setPosition((this.width - childWidth) / 2, (this.height - childHeight) / 2 + offsetY)
        return this
    }

    public positionChild(child: UIContainer, x: number, y: number): this {
        child.setPosition(x, y)
        return this
    }

    public clear(): this {
        this.removeAll(true)
        // Восстанавливаем фон
        if (this.bg) {
            this.add(this.bg)
        }
        return this
    }
}