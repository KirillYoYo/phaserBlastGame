import { produce } from 'immer'

import { Tile } from '@/game/entities/Tile'

import { GameState } from '../state/state'

export function applyGravity(state: GameState): GameState {
    return produce(state, draft => {
        const updateItem = (tile: Tile, writeY: number, x: number) => {
            draft.grid[writeY][x] = tile
            draft.tilesById.set(tile.id, tile)
        }
        for (let x = 0; x < draft.grid[0].length; x++) {
            let writeY = draft.grid.length - 1

            for (let y = draft.grid.length - 1; y >= 0; y--) {
                if (draft.grid[y][x]) {
                    const tile = draft.grid[y][x]!
                    draft.grid[y][x] = null
                    tile.y = writeY
                    /**/
                    updateItem(tile, writeY, x)
                    writeY--
                }
            }
        }
    })
}
