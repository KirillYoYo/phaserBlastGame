import { GameState } from '../state/state'
import { TileColor } from '../entities/Tile'

const COLORS: TileColor[] = ['red', 'green', 'blue', 'yellow']

export function refill(state: GameState): GameState {
    const grid = state.grid.map(row => row.slice())
    let nextId = state.nextTileId

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (!grid[y][x]) {
                grid[y][x] = {
                    id: nextId++,
                    x,
                    y,
                    color: COLORS[Math.floor(Math.random() * COLORS.length)],
                }
            }
        }
    }

    return { ...state, grid, nextTileId: nextId }
}
