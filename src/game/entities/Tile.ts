export type TileColor = 'red' | 'green' | 'blue' | 'yellow';

export interface Tile {
    id: number;
    x: number;
    y: number;
    color: TileColor;
}
