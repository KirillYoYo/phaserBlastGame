import { GameState } from './state';
import { TileColor } from '../entities/Tile';

const COLORS: TileColor[] = ['red', 'green', 'blue', 'yellow'];

export function createInitialState(
    cols: number,
    rows: number
): GameState {
    let id = 0;

    const grid = Array.from({ length: rows }, (_, y) =>
        Array.from({ length: cols }, (_, x) => ({
            id: id++,
            x,
            y,
            color: COLORS[Math.floor(Math.random() * COLORS.length)]
        }))
    );

    return {
        grid,
        score: 0,
        nextTileId: id
    };
}
