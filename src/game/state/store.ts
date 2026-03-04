import { AUTO } from 'phaser'
import { configureStore } from '@reduxjs/toolkit'

import { Boot } from '@/game/scenes/Boot'
import { Preloader } from '@/game/scenes/Preloader'
import { GameScene as MainGame } from '@/game/scenes/GameScene'
import { GameOver } from '@/game/scenes/GameOver'

import gameReducer from './gameSlice'

export const store = configureStore({
    reducer: {
        game: gameReducer,
    },
    // Добавляем middleware для логирования в разработке
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            // Разрешаем Map в состоянии
            serializableCheck: {
                ignoredPaths: ['game.tilesById', 'game.grid'],
                ignoredActions: ['game/tileClicked', 'game/boosterClicked'],
            },
        }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const config = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scale: {
        /* mode: Phaser.Scale.RESIZE, */
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [Boot, Preloader, MainGame, GameOver],
    game: { cols: 8, rows: 8 },
}