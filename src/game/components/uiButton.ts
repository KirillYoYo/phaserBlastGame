export interface UIButtonConfig {
    x: number
    y: number

    backgroundKey: string
    iconKey?: string

    text?: string
    textStyle?: Phaser.Types.GameObjects.Text.TextStyle

    width?: number
    height?: number

    iconOffsetX?: number
    iconOffsetY?: number
    textOffsetX?: number
    textOffsetY?: number

    onClick?: () => void

    isActive?: boolean
}

export class UIButton extends Phaser.GameObjects.Container {
    background: Phaser.GameObjects.Image
    icon?: Phaser.GameObjects.Image
    label?: Phaser.GameObjects.Text

    constructor(scene: Phaser.Scene, config: UIButtonConfig) {
        super(scene, config.x, config.y)
        scene.add.existing(this)

        /* ---------- BACKGROUND ---------- */

        this.background = scene.add.image(0, 0, config.backgroundKey)
        this.background.setOrigin(0.5)

        if (config.width || config.height) {
            this.background.setDisplaySize(
                config.width ?? this.background.width,
                config.height ?? this.background.height
            )
        }

        this.add(this.background)

        /* ---------- ICON ---------- */

        if (config.iconKey) {
            this.icon = scene.add.image(
                config.iconOffsetX ?? -20,
                config.iconOffsetY ?? 0,
                config.iconKey
            )
            this.icon.setOrigin(0.5)
            this.add(this.icon)
            this.icon.setX(0)
            this.icon.setY(0)
        }

        /* ---------- TEXT ---------- */

        if (config.text) {
            this.label = scene.add.text(
                config.textOffsetX ?? (this.icon ? 10 : 0),
                config.textOffsetY ?? 0,
                config.text,
                {
                    fontSize: '20px',
                    color: '#ffffff',
                    ...config.textStyle,
                }
            )
            this.label.setOrigin(0.5)
            this.add(this.label)
        }

        /* ---------- INTERACTION ---------- */

        this.setSize(this.background.displayWidth, this.background.displayHeight)

        this.setInteractive(
            new Phaser.Geom.Rectangle(0, 0, this.width, this.height),
            Phaser.Geom.Rectangle.Contains
        )

        this.setupInteractions(config.onClick)
    }

    /* --------------------------- INTERACTIONS --------------------------- */

    private setupInteractions(onClick?: () => void) {
        this.on('pointerdown', () => {
            this.scene.tweens.add({
                targets: this,
                scale: 0.95,
                duration: 80,
                ease: 'Quad.Out',
            })
        })

        this.on('pointerup', () => {
            this.scene.tweens.add({
                targets: this,
                scale: 1.05,
                duration: 80,
                ease: 'Quad.Out',
            })
            onClick?.()
        })
    }

    /* ------------------------------ API ------------------------------ */

    setText(text: string) {
        this.label?.setText(text)
        return this
    }

    setIcon(key: string) {
        if (this.icon) {
            this.icon.setTexture(key)
        }
        return this
    }

    setDisabled(disabled: boolean) {
        this.setAlpha(disabled ? 0.5 : 1)
        this.disableInteractive()

        if (!disabled) {
            this.setInteractive()
        }
    }

    setActive(value: boolean) {
        if (value) {
            this.scale = 1.1
        } else {
            this.scale = 1
        }

        return this
    }
}