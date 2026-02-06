import { produce } from 'immer'

import { GameState } from '../state/state'
import { TileColor } from '../entities/Tile'

const COLORS: TileColor[] = ['red', 'green', 'blue', 'yellow']

export function refill(state: GameState): GameState {
    return produce(state, draft => {
        let nextId = draft.nextTileId

        for (let y = 0; y < draft.grid.length; y++) {
            for (let x = 0; x < draft.grid[y].length; x++) {
                if (!draft.grid[y][x]) {
                    draft.grid[y][x] = {
                        id: nextId++,
                        x,
                        y,
                        color: COLORS[Math.floor(Math.random() * COLORS.length)],
                    }
                }
            }
        }

        draft.nextTileId = nextId
    })
}
