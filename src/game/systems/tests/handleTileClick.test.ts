import { expect, it } from '@jest/globals'

import { handleTileClick } from '@/game/systems/ClickSystem'
import { expectGrid, gridFromDSL } from '@/game/systems/tests/adapters'

it('removes connected group and adds score', () => {
    const state = {
        grid: gridFromDSL(`
            RRG
            RBG
            BBB
        `),
        score: 0,
        nextTileId: 0,
    }

    const next = handleTileClick(state, 0, 0)

    expectGrid(
        next,
        `
        ..G
        .BG
        BBB
    `
    )

    expect(next.score).toBe(30)
})
