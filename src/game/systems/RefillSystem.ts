import { produce } from 'immer'

import { GameState } from '../state/state'
import { Tile, TileColor } from '../entities/Tile'

const COLORS: TileColor[] = ['red', 'green', 'blue', 'yellow']

export function refill(state: GameState): GameState {
    return produce(state, draft => {
        let nextId = draft.nextTileId
        const addItem = (tile: Tile) => {
            draft.grid[tile.y][tile.x] = tile
            /**/
            draft.tilesById.set(tile.id, tile)
        }

        for (let y = 0; y < draft.grid.length; y++) {
            for (let x = 0; x < draft.grid[y].length; x++) {
                if (!draft.grid[y][x]) {
                    const newTile = {
                        id: nextId++,
                        x,
                        y,
                        color: COLORS[Math.floor(Math.random() * COLORS.length)],
                    }
                    addItem(newTile)
                }
            }
        }

        draft.nextTileId = nextId
    })
}
