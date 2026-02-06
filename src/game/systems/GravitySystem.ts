import { GameState } from '../state/state'

export function applyGravity(state: GameState): GameState {
    const grid = state.grid.map(row => row.slice())

    for (let x = 0; x < grid[0].length; x++) {
        let writeY = grid.length - 1

        for (let y = grid.length - 1; y >= 0; y--) {
            if (grid[y][x]) {
                const tile = grid[y][x]!
                grid[y][x] = null
                tile.y = writeY
                grid[writeY][x] = tile
                writeY--
            }
        }
    }

    return { ...state, grid }
}
