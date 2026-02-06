import { produce } from 'immer'

import { GameState } from '../state/state'

export function applyGravity(state: GameState): GameState {
    return produce(state, draft => {
        for (let x = 0; x < draft.grid[0].length; x++) {
            let writeY = draft.grid.length - 1

            for (let y = draft.grid.length - 1; y >= 0; y--) {
                if (draft.grid[y][x]) {
                    const tile = draft.grid[y][x]!
                    draft.grid[y][x] = null
                    tile.y = writeY
                    draft.grid[writeY][x] = tile
                    writeY--
                }
            }
        }
    })
}
