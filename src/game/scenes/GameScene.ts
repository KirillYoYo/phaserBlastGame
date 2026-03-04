import { GameState } from '@/game/state/state'
import { TilesBoard } from '@/game/components/TilesBoard'
import { LayoutManager } from '@/game/components/LayoutManager'
import { store } from '@/game/state/store'

export class GameScene extends Phaser.Scene {
    layout: LayoutManager
    tilesBoard: TilesBoard | null
    scores: number
    state!: GameState

    constructor() {
        super('GameScene')
        this.tilesBoard = null
        this.layout = new LayoutManager(this)
        this.scores = store.getState().game.scores
    }

    create() {
        this.layout.create()

        this.layout.header.setTitle(this.scores)
        this.tilesBoard = new TilesBoard(
            this,
            this.layout.content.x,
            this.layout.header.getBounds().height
        )
        this.tilesBoard.create()

        this.layout.content.add(this.tilesBoard)
        this.layout.content.centerChild(this.tilesBoard)
        this.tilesBoard.fx.red.x = this.tilesBoard.x
        this.tilesBoard.fx.blue.x = this.tilesBoard.x
        this.tilesBoard.fx.green.x = this.tilesBoard.x
        this.tilesBoard.fx.yellow.x = this.tilesBoard.x
        this.tilesBoard.fx.purpure.x = this.tilesBoard.x

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

    preload() {
        this.load.image('headerFrame', 'src/assets/bg_frame_moves.png')
        this.load.image('moves', 'src/assets/bg_moves.png')
        this.load.image('scores', 'src/assets/slot_frame_moves.png')
        /**/
        this.load.image('b_blue', 'src/assets/block_blue.png')
        this.load.image('b_green', 'src/assets/block_green.png')
        this.load.image('b_purpure', 'src/assets/block_purpure.png')
        this.load.image('b_red', 'src/assets/block_red.png')
        this.load.image('b_yellow', 'src/assets/block_yellow.png')
        this.load.image('bg_booster', 'src/assets/bg_booster.png')
        this.load.image('booster_bomb', 'src/assets/icon_booster_bomb.png')
        this.load.image('booster_teleport', 'src/assets/icon_booster_teleport.png')
    }
}