import { Tile } from '../entities/Tile'

export interface GameState {
    grid: (Tile | null)[][]
    scores: number
    scoresToWin: number
    nextTileId: number
    tilesById: Map<number, Tile>
    deletedTiles: number[]
    moves: number
}