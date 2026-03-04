import Phaser from 'phaser'

import { store } from '@/game/state/store'
import { GameState } from '@/game/state/state'
import { Header } from '@/game/components/header'
import { Content } from '@/game/components/content'
import { Footer } from '@/game/components/footer'
import { UIButton } from '@/game/components/uiButton'
import { boosterClicked } from '@/game/state/gameSlice'

export class LayoutManager {
    public header: Header
    public content: Content
    public footer: Footer

    private scene: Phaser.Scene
    private localStore: { moves: number; scores: number; scoresToWin: number }

    private bombButton: UIButton
    private teleportButton: UIButton

    store: GameState

    constructor(scene: Phaser.Scene) {
        this.scene = scene

        this.localStore = {
            moves: 0,
            scores: 0,
            scoresToWin: 0,
        }

        store.subscribe(() => {
            const state = store.getState()
            this.sync(state.game)
        })
    }

    sync(state: GameState) {
        if (state.currentBooster === 'bomb') {
            this.bombButton.setActive(true)
            this.teleportButton.setActive(false)
        }
        if (state.currentBooster === 'teleport') {
            this.bombButton.setActive(false)
            this.teleportButton.setActive(true)
        }
        if (!state.currentBooster) {
            this.bombButton.setActive(false)
            this.teleportButton.setActive(false)
        }
        this.localStore = {
            ...this.localStore,
            moves: state.moves,
            scores: state.scores,
            scoresToWin: state.scoresToWin,
        }
        const scoresText = this.header.getByName('scoresText') as Phaser.GameObjects.Text
        scoresText.setText(`${state.scores}/${state.scoresToWin}`)
        this.bombButton.setText(`${state.boosters.bomb}`)
        this.teleportButton.setText(`${state.boosters.teleport}`)
    }

    public create(): this {
        const { width, height } = this.scene.scale

        const headerHeight = height * 0.15
        const contentHeight = height * 0.7
        const footerHeight = height * 0.15

        this._createHeader(width, headerHeight)
        this.content = new Content(this.scene, 0, headerHeight, width, contentHeight)
        this.footer = new Footer(this.scene, 0, headerHeight + contentHeight, width, footerHeight)

        this._createFooter()

        this.store = store.getState().game
        return this
    }

    public resize(): this {
        const { width, height } = this.scene.scale

        const headerHeight = height * 0.25
        const contentHeight = height * 0.6
        const footerHeight = height * 0.15
        this.header.setSize(width, headerHeight)
        this.content.setSize(width, contentHeight)
        this.content.setPosition(0, headerHeight)
        this.footer.setSize(width, footerHeight)
        this.footer.setPosition(0, headerHeight + contentHeight)

        return this
    }

    _createHeader(width: number, headerHeight: number) {
        this.header = new Header(this.scene, 0, 0, width, headerHeight)
        const frameWidth = this.header.width * 0.65

        const frameSprite = this.scene.add
            .nineslice(
                this.header.width * 0.5 - frameWidth / 2,
                0, // позиция
                'headerFrame',
                100,
                frameWidth,
                headerHeight + 15,
                150,
                150,
                50,
                70
            )
            .setInteractive()
            .setOrigin(0)

        const movesSprite = this.scene.add
            .sprite(frameSprite.x + frameSprite.width / 5.6, 5, 'moves')
            .setInteractive()
            .setOrigin(0)
        movesSprite.setDisplaySize(headerHeight * 0.9, headerHeight * 0.9)
        movesSprite.setDisplaySize(headerHeight * 0.9, headerHeight * 0.9)
        const moveSpriteBounds = movesSprite.getBounds()

        const movesText = this.scene.add.text(
            movesSprite.x + moveSpriteBounds.width / 2,
            movesSprite.y,
            `${this.localStore.moves}`,
            {
                fontSize: '48px',
                color: '#ecf0f1',
            }
        )
        movesText.setX(movesSprite.x + moveSpriteBounds.width / 2 - movesText.width / 2)
        movesText.setY(movesSprite.y + moveSpriteBounds.height / 2 - movesText.height / 2)

        const scoresText = this.scene.add.text(
            moveSpriteBounds.x,
            movesSprite.y,
            `${this.localStore.scores}/${this.localStore.scoresToWin}`,
            {
                fontSize: '48px',
                color: '#ecf0f1',
            }
        )
        scoresText.setY(movesSprite.y + moveSpriteBounds.height / 2 - scoresText.height / 2)
        scoresText.setX(moveSpriteBounds.x + scoresText.width + 40)
        scoresText.setName('scoresText')

        this.header.add(frameSprite)
        this.header.add(movesSprite)
        this.header.add(movesText)
        this.header.add(scoresText)
    }

    _createFooter() {
        this.bombButton = new UIButton(this.scene, {
            x: 0,
            y: this.footer.height / 2,
            backgroundKey: 'bg_booster',
            iconKey: 'booster_bomb',
            text: 'PLAY',
            height: this.footer.height,
            onClick: () => store.dispatch(boosterClicked('bomb')),
        })
        this.footer.add(this.bombButton)
        this.bombButton.setX(this.bombButton.width / 2)
        /**/
        this.teleportButton = new UIButton(this.scene, {
            x: 0,
            y: this.footer.height / 2,
            backgroundKey: 'bg_booster',
            iconKey: 'booster_teleport',
            text: 'PLAY',
            height: this.footer.height,
            onClick: () => store.dispatch(boosterClicked('teleport')),
        })
        this.footer.add(this.teleportButton)
        this.teleportButton.setX(this.bombButton.width / 2 + this.teleportButton.width)
    }
}