import { produce } from 'immer'

import { Tile } from '@/game/entities/Tile'

import { GameState } from '../state/state'

import { findBombedTiles, findConnectedTiles } from './MatchSystem'

// todo в конфиг или в стейт
const BOMBED_RADIUS = 1

export function handleTileClick(
    state: GameState,
    x: number,
    y: number,
    conf?: { isBomb: boolean }
) {
    return produce(state, draft => {
        draft.deletedTiles = []
        const deleteItems = (tile: Tile) => {
            draft.grid[tile.y][tile.x] = null
            draft.tilesById.delete(tile.id)
            /**/
            draft.deletedTiles.push(tile.id)
        }

        const group = conf?.isBomb
            ? findBombedTiles(draft.grid, x, y, BOMBED_RADIUS)
            : findConnectedTiles(draft.grid, x, y)
        if (group.length < 2) return

        for (const tile of group) {
            deleteItems(tile)
        }
        draft.scores += group.length * 10
    })
}