import { GameState } from '@/game/state/state'
import { TilesBoard } from '@/game/components/TilesBoard'
import { LayoutManager } from '@/game/components/LayoutManager'
import { gameStore } from '@/game/state/store'

export class GameScene extends Phaser.Scene {
    layout: LayoutManager
    tilesBoard: TilesBoard | null
    scores: number
    state!: GameState

    constructor() {
        super('GameScene')
        this.tilesBoard = null
        this.layout = new LayoutManager(this)
        this.scores = gameStore.getState().scores

        gameStore.subscribeSelective(
            state => state.scores,
            score => {
                this.sync(score)
            }
        )
    }

    preload() {
        this.load.image('headerFrame', 'src/assets/bg_frame_moves.png')
        this.load.image('moves', 'src/assets/bg_moves.png')
        this.load.image('scores', 'src/assets/slot_frame_moves.png')
    }

    create() {
        this.layout.create()

        this.layout.header.setTitle(this.scores)

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

    // update(time: number, delta: number): void {
    //     // Пример обновления таймера в футере
    //     // this.layout.footer.setTimer(this.state.remainingTime)
    // }

    sync(score: number) {
        this.scores = score
        this.layout.header.setTitle(this.scores)
    }
}