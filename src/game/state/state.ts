import { Tile } from '../entities/Tile'

export interface BoosterType {
    bomb: number
    teleport: number
    teleportFirst: undefined | Tile
    teleportSecond: undefined | Tile
}

export type BoosterNames = 'teleport' | 'bomb' | undefined

export interface GameState {
    grid: (Tile | null)[][]
    scores: number
    scoresToWin: number
    nextTileId: number
    tilesById: Map<number, Tile>
    deletedTiles: number[]
    moves: number
    currentBooster: BoosterNames
    boosters: BoosterType
}