import { produce } from 'immer'

import { GameState } from '../state/state'

import { findConnectedTiles } from './MatchSystem'

export function handleTileClick(state: GameState, x: number, y: number) {
    return produce(state, draft => {
        const group = findConnectedTiles(draft.grid, x, y)
        if (group.length < 2) return

        for (const tile of group) {
            draft.grid[tile.y][tile.x] = null
        }
        draft.score += group.length * 10
    })
}
