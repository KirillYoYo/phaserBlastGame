import { Tile } from '../entities/Tile'

export interface GameState {
    grid: (Tile | null)[][]
    score: number
    nextTileId: number
}
