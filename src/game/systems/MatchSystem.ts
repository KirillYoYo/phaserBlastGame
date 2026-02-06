import { Tile } from '../entities/Tile';

export function findConnectedTiles(
    grid: (Tile | null)[][],
    startX: number,
    startY: number
): Tile[] {
    const start = grid[startY]?.[startX];
    if (!start) return [];

    const visited = new Set<number>();
    const result: Tile[] = [];

    function dfs(x: number, y: number) {
        const tile = grid[y]?.[x];
        if (!tile) return;
        if (tile.color !== start?.color) return;
        if (visited.has(tile.id)) return;

        visited.add(tile.id);
        result.push(tile);

        dfs(x + 1, y);
        dfs(x - 1, y);
        dfs(x, y + 1);
        dfs(x, y - 1);
    }

    dfs(startX, startY);
    return result;
}
