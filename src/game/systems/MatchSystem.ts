import { Tile } from '../entities/Tile'

export function findConnectedTiles(
    grid: (Tile | null)[][],
    startX: number,
    startY: number
): Tile[] {
    const start = grid[startY]?.[startX]
    if (!start) return []

    const visited = new Set<number>()
    const result: Tile[] = []

    function dfs(x: number, y: number) {
        const tile = grid[y]?.[x]
        if (!tile) return
        if (tile.color !== start?.color) return
        if (visited.has(tile.id)) return

        visited.add(tile.id)
        result.push(tile)

        dfs(x + 1, y)
        dfs(x - 1, y)
        dfs(x, y + 1)
        dfs(x, y - 1)
    }

    dfs(startX, startY)
    return result
}

type DistanceMetric = 'manhattan' | 'chebyshev' | 'euclidean'

export function findBombedTiles(
    grid: (Tile | null)[][],
    startX: number,
    startY: number,
    radius: number,
    metric: DistanceMetric = 'chebyshev'
): Tile[] {
    const start = grid[startY]?.[startX]
    if (!start) return []

    const visited = new Set<number>()
    const result: Tile[] = []

    const queue: [number, number][] = [[startX, startY]]
    visited.add(start.id)
    result.push(start)

    const getDistance = (x1: number, y1: number, x2: number, y2: number): number => {
        switch (metric) {
            case 'manhattan':
                return Math.abs(x1 - x2) + Math.abs(y1 - y2)
            case 'chebyshev':
                return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2))
            case 'euclidean':
                return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
            default:
                return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2))
        }
    }

    while (queue.length > 0) {
        const [x, y] = queue.shift()!

        // Все 8 направлений
        const directions = [
            [x + 1, y],
            [x - 1, y],
            [x, y + 1],
            [x, y - 1], // крест
            [x + 1, y + 1],
            [x + 1, y - 1],
            [x - 1, y + 1],
            [x - 1, y - 1], // диагонали
        ]

        for (const [nx, ny] of directions) {
            const tile = grid[ny]?.[nx]
            if (!tile) continue
            if (visited.has(tile.id)) continue

            const distance = getDistance(nx, ny, startX, startY)

            if (distance <= radius) {
                visited.add(tile.id)
                result.push(tile)
                queue.push([nx, ny])
            }
        }
    }

    return result
}