import { handleTileClick } from '@/game/systems/ClickSystem'
import { applyGravity } from '@/game/systems/GravitySystem'
import { refill } from '@/game/systems/RefillSystem'
import { GameState } from '@/game/state/state'
import { Action } from '@/game/state/store'

export function reduce(state: GameState, action: Action): GameState {
    switch (action.type) {
        case 'TILE_CLICKED': {
            const tile = state.tilesById.get(action.tileId)
            if (!tile) return state

            let next = handleTileClick(state, tile.x, tile.y)
            next = applyGravity(next)
            next = refill(next)

            return {
                ...next,
            }
        }

        default:
            return state
    }
}
