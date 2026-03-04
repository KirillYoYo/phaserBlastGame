import { createSelector } from '@reduxjs/toolkit'

import { RootState } from './store'

export const selectGame = (state: RootState) => state.game

export const selectScores = createSelector(selectGame, game => game.scores)

export const selectMoves = createSelector(selectGame, game => game.moves)

export const selectBoosters = createSelector(selectGame, game => game.boosters)

export const selectGrid = createSelector(selectGame, game => game.grid)

export const selectCurrentBooster = createSelector(selectGame, game => game.currentBooster)