import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { handleTileClick } from '@/game/systems/ClickSystem'
import { applyGravity } from '@/game/systems/GravitySystem'
import { refill } from '@/game/systems/RefillSystem'

import { Tile, TileColor } from '../entities/Tile'

import { BoosterNames, GameState } from './state'

const COLORS: TileColor[] = ['red', 'green', 'blue', 'yellow', 'purpure']

const createInitialState = (cols: number, rows: number): GameState => {
    let id = 0

    const tilesById = new Map<number, Tile>()

    const grid = Array.from({ length: rows }, (_, y) =>
        Array.from({ length: cols }, (_, x) => {
            const newTile = {
                id: id++,
                x,
                y,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
            }
            tilesById.set(newTile.id, newTile)
            return newTile
        })
    )

    return {
        grid,
        scores: 0,
        scoresToWin: 1000,
        nextTileId: id,
        tilesById: tilesById,
        deletedTiles: [],
        moves: 0,
        currentBooster: undefined,
        boosters: {
            bomb: 5,
            teleport: 5,
            teleportFirst: null,
            teleportSecond: null,
        },
    }
}

const initialState: GameState = createInitialState(8, 8) // или берите из config

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        tileClicked: (state, action: PayloadAction<number>) => {
            const tile = state.tilesById.get(action.payload)
            if (!tile) return

            if (state.currentBooster === 'bomb') {
                // Прямое использование систем с мутацией
                let next = handleTileClick(state, tile.x, tile.y, { isBomb: true })
                next = applyGravity(next)
                next = refill(next)

                // Копируем поля из next в state
                Object.assign(state, next)

                // Дополнительные мутации
                state.currentBooster = undefined
                state.boosters.bomb--
            } else if (state.currentBooster === 'teleport') {
                if (!state.boosters.teleportFirst) {
                    state.boosters.teleportFirst = tile
                } else {
                    // Логика телепорта прямо здесь
                    const first = state.boosters.teleportFirst

                    // Меняем местами
                    const x1 = first.x,
                        y1 = first.y
                    const x2 = tile.x,
                        y2 = tile.y

                    const tileA = state.grid[y1][x1]
                    const tileB = state.grid[y2][x2]

                    if (tileA && tileB) {
                        state.grid[y1][x1] = tileB
                        state.grid[y2][x2] = tileA

                        tileA.x = x2
                        tileA.y = y2
                        tileB.x = x1
                        tileB.y = y1

                        state.tilesById.set(tileA.id, tileA)
                        state.tilesById.set(tileB.id, tileB)
                    }

                    // Сброс бустера
                    state.boosters.teleportFirst = undefined
                    state.boosters.teleportSecond = undefined
                    state.currentBooster = undefined
                    state.boosters.teleport--
                }
            } else {
                // Обычный клик
                let next = handleTileClick(state, tile.x, tile.y)
                next = applyGravity(next)
                next = refill(next)

                Object.assign(state, next)
            }
        },

        boosterClicked: (state, action: PayloadAction<BoosterNames>) => {
            state.deletedTiles = []
            state.currentBooster = action.payload
            state.boosters.teleportFirst = undefined
            state.boosters.teleportSecond = undefined
        },

        resetGame: () => createInitialState(8, 8),

        applyGravityAndRefill: state => {
            let next = applyGravity(state)
            next = refill(next)
            Object.assign(state, next)
        },
    },
})

export const { tileClicked, boosterClicked, resetGame, applyGravityAndRefill } = gameSlice.actions
export default gameSlice.reducer