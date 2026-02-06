import { GameState } from '../state/state'

import { findConnectedTiles } from './MatchSystem'

export function handleTileClick(state: GameState, x: number, y: number): GameState {
    const group = findConnectedTiles(state.grid, x, y)
    if (group.length < 2) return state

    const newGrid = state.grid.map(row => row.slice())

    for (const tile of group) {
        newGrid[tile.y][tile.x] = null
    }

    return {
        ...state,
        grid: newGrid,
        score: state.score + group.length * 10,
    }
}
