import { GameState } from '@/game/state/state'
import { TilesBoard } from '@/game/components/TilesBoard'
import { LayoutManager } from '@/game/components/LayoutManager'

export class GameScene extends Phaser.Scene {
    layout: LayoutManager
    tilesBoard: TilesBoard | null
    state!: GameState

    constructor() {
        super('GameScene')
        this.tilesBoard = null
        this.layout = new LayoutManager(this)
    }

    create() {
        this.layout.create()

        this.layout.header.setTitle('MY GAME')

        this.tilesBoard = new TilesBoard(this, 0, 0)
        this.tilesBoard.create()

        this.layout.content.add(this.tilesBoard)
        this.layout.content.centerChild(this.tilesBoard)

        this.layout.footer.setText('Ready to play!').setScore(0).setTimer(60)

        this.scale.on('resize', this.onResize, this)
    }

    private onResize(gameSize: Phaser.Structs.Size): void {
        const { width, height } = gameSize

        this.layout.resize()

        if (this.tilesBoard) {
            this.layout.content.centerChild(this.tilesBoard)
        }
    }

    update(time: number, delta: number): void {
        // Пример обновления таймера в футере
        // this.layout.footer.setTimer(this.state.remainingTime)
    }
}
