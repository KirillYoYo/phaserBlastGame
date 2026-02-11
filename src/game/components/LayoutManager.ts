import Phaser from 'phaser'

abstract class UIContainer extends Phaser.GameObjects.Container {
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

export class Footer extends UIContainer {
    private text: Phaser.GameObjects.Text
    private scoreText?: Phaser.GameObjects.Text
    private timerText?: Phaser.GameObjects.Text

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
        super(scene, x, y, width, height, 0x1a252f)
        this.init()
    }

    private init(): void {
        this.text = this.scene.add.text(this.width / 2, 20, 'FOOTER', {
            fontSize: '20px',
            color: '#ffffff',
            fontFamily: 'Arial',
        })
        this.text.setOrigin(0.5)
        this.add(this.text)
    }

    // Основной текст
    public setText(text: string): this {
        this.text.setText(text)
        return this
    }

    // Счет (пример дополнительного элемента)
    public setScore(score: number): this {
        if (!this.scoreText) {
            this.scoreText = this.scene.add.text(20, this.height / 2, `Score: ${score}`, {
                fontSize: '18px',
                color: '#ecf0f1',
            })
            this.scoreText.setOrigin(0, 0.5)
            this.add(this.scoreText)
        } else {
            this.scoreText.setText(`Score: ${score}`)
        }
        return this
    }

    // Таймер (пример дополнительного элемента)
    public setTimer(seconds: number): this {
        if (!this.timerText) {
            this.timerText = this.scene.add.text(
                this.width - 20,
                this.height / 2,
                `Time: ${seconds}s`,
                {
                    fontSize: '18px',
                    color: '#ecf0f1',
                }
            )
            this.timerText.setOrigin(1, 0.5)
            this.add(this.timerText)
        } else {
            this.timerText.setText(`Time: ${seconds}s`)
        }
        return this
    }
}

export class LayoutManager {
    public header: Header
    public content: Content
    public footer: Footer

    private scene: Phaser.Scene

    constructor(scene: Phaser.Scene) {
        this.scene = scene
    }

    public create(): this {
        const { width, height } = this.scene.scale

        const headerHeight = height * 0.15
        const contentHeight = height * 0.7
        const footerHeight = height * 0.15

        this.header = new Header(this.scene, 0, 0, width, headerHeight)
        this.content = new Content(this.scene, 0, headerHeight, width, contentHeight)
        this.footer = new Footer(this.scene, 0, headerHeight + contentHeight, width, footerHeight)

        return this
    }

    public resize(): this {
        const { width, height } = this.scene.scale

        const headerHeight = height * 0.15
        const contentHeight = height * 0.7
        const footerHeight = height * 0.15
        this.header.setSize(width, headerHeight)
        this.content.setSize(width, contentHeight)
        this.content.setPosition(0, headerHeight)
        this.footer.setSize(width, footerHeight)
        this.footer.setPosition(0, headerHeight + contentHeight)

        return this
    }
}
