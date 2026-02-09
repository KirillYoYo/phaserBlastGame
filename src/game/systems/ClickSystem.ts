import { produce } from 'immer'

import { Tile } from '@/game/entities/Tile'

import { GameState } from '../state/state'

import { findConnectedTiles } from './MatchSystem'

export function handleTileClick(state: GameState, x: number, y: number) {
    return produce(state, draft => {
        const deleteItems = (tile: Tile) => {
            draft.grid[tile.y][tile.x] = null
            draft.tilesById.delete(tile.id)
            /**/
            draft.deletedTiles.push(tile.id)
        }

        const group = findConnectedTiles(draft.grid, x, y)
        if (group.length < 2) return

        for (const tile of group) {
            deleteItems(tile)
        }
        draft.score += group.length * 10
    })
}
