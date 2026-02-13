export type TileColor = 'red' | 'green' | 'blue' | 'yellow' | 'purpure'

export interface Tile {
    id: number
    x: number
    y: number
    color: TileColor
}