import { produce } from 'immer'

import { handleTileClick } from '@/game/systems/ClickSystem'
import { applyGravity } from '@/game/systems/GravitySystem'
import { refill } from '@/game/systems/RefillSystem'
import { GameState } from '@/game/state/state'
import { Action } from '@/game/state/store'
import { Tile } from '@/game/entities/Tile'

export function reduce(state: GameState, action: Action): GameState {
    const normalClick = (state: GameState, tile: Tile) => {
        let next = handleTileClick(state, tile.x, tile.y)
        next = applyGravity(next)
        next = refill(next)

        return next
    }
    const bombClick = (state: GameState, tile: Tile) => {
        let next = handleTileClick(state, tile.x, tile.y, { isBomb: true })
        next = applyGravity(next)
        next = refill(next)

        return next
    }
    const teleportClick = (state: GameState, tile: Tile): GameState => {
        const first = state.boosters.teleportFirst
        if (!first) return state

        return produce(state, draft => {
            const x1 = first.x
            const y1 = first.y
            const x2 = tile.x
            const y2 = tile.y

            const tileA = draft.grid[y1][x1]
            const tileB = draft.grid[y2][x2]

            if (!tileA || !tileB) return

            draft.grid[y1][x1] = tileB
            draft.grid[y2][x2] = tileA

            tileA.x = x2
            tileA.y = y2

            tileB.x = x1
            tileB.y = y1

            // 🗺 обновляем map
            draft.tilesById.set(tileA.id, tileA)
            draft.tilesById.set(tileB.id, tileB)

            // 🧹 сброс бустера
            draft.boosters.teleportFirst = undefined
            draft.boosters.teleportSecond = undefined
            draft.currentBooster = undefined
            draft.boosters.teleport--
        })
    }

    switch (action.type) {
        case 'TILE_CLICKED': {
            const tile = state.tilesById.get(action.tileId)
            if (!tile) return state

            if (state.currentBooster) {
                switch (state.currentBooster) {
                    case 'bomb': {
                        const next = bombClick(state, tile)
                        const newState = produce(next, draft => {
                            draft.currentBooster = undefined
                            draft.boosters.bomb--
                        })
                        return {
                            ...newState,
                        }
                    }
                    case 'teleport': {
                        if (!state.boosters.teleportFirst) {
                            const newState = produce(state, draft => {
                                draft.boosters.teleportFirst = tile
                            })
                            return {
                                ...newState,
                            }
                        }
                        if (state.boosters.teleportFirst) {
                            return teleportClick(state, tile)
                        }
                    }
                }
            }

            const next = normalClick(state, tile)

            return {
                ...next,
            }
        }
        case 'BOOSTER_CLICKED':
            return produce(state, draft => {
                draft.deletedTiles = []
                draft.currentBooster = action.booster
                draft.boosters.teleportFirst = undefined
                draft.boosters.teleportSecond = undefined
            })

        default:
            return state
    }
}