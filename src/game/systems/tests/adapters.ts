import { expect } from '@jest/globals'

import { GameState } from '@/game/state/state'

type TileColor = 'red' | 'green' | 'blue'

const colorMap: Record<string, TileColor> = {
    R: 'red',
    G: 'green',
    B: 'blue',
}

let nextId = 1

export function gridFromDSL(dsl: string) {
    nextId = 1

    return dsl
        .trim()
        .split('\n')
        .map((row, y) =>
            row
                .trim()
                .split('')
                .map((char, x) => {
                    if (char === '.') return null

                    return {
                        id: nextId++,
                        x,
                        y,
                        color: colorMap[char],
                    }
                })
        )
}

export function expectGrid(state: GameState, dsl: string) {
    const expected = gridFromDSL(dsl)

    expect(state.grid.map(row => row.map(tile => tile?.color ?? null))).toEqual(
        expected.map(row => row.map(tile => tile?.color ?? null))
    )
}
