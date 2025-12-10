/**
 * MAP MODULE
 * Defines the 10x10 dungeon grid with tile-based system.
 * Each tile can have specific allowed directions and unique properties.
 */

// Basic corridor descriptions (randomly selected for generic corridors)
const corridorDescriptions = [
    "A narrow stone corridor stretches before you. Your footsteps echo off damp walls.",
    "The passage is cramped and cold. Shadows dance in the flickering darkness.",
    "A simple corridor. Water drips from above, leaving dark stains on the stone.",
    "The walls press in close. The air tastes of dust and decay.",
    "An unremarkable passage. You've seen a hundred corridors like this.",
    "Stone walls on all sides. The darkness feels almost alive here.",
    "Carved from raw stone, this passage leads deeper into shadow.",
    "The corridor widens slightly here. Strange markings cover the walls.",
    "You walk in silence. Your heartbeat echoes louder than your footsteps.",
    "The air grows colder as you advance through the passage."
];

/**
 * The dungeon map - 10x10 grid
 * Format: map[y][x] where (0,0) is top-left
 * Each tile can have: type, allowedExits, npc, items, etc.
 */
const dungeonMap = [
    // Y=0
    [null, null, null, null, null, null, null, null, null, null],
    // Y=1
    [{type: 'corridor', allowedExits: ['east', 'south']}, {type: 'corridor', allowedExits: ['east', 'west']}, {type: 'corridor', allowedExits: ['east', 'south', 'west']}, {type: 'corridor', allowedExits: ['east', 'west']}, {type: 'corridor', allowedExits: ['east', 'south', 'west']}, {type: 'corridor', allowedExits: ['east', 'west']}, {type: 'corridor', allowedExits: ['east', 'west']}, {type: 'corridor', allowedExits: ['east', 'west']}, {type: 'merchant', npc: 'merchant', allowedExits: ['west']}, null],
    // Y=2
    [{type: 'corridor', allowedExits: ['north', 'south']}, null, {type: 'corridor', allowedExits: ['north', 'south']}, null, {type: 'locked_door', allowedExits: ['north', 'south']}, null, null, null, null, null],
    // Y=3
    [{type: 'circle2', allowedExits: ['north', 'east']}, {type: 'corridor', allowedExits: ['east', 'west']}, {type: 'corridor', allowedExits: ['north', 'west']}, {type: 'para', allowedExits: ['east']}, {type: 'corridor', allowedExits: ['north', 'east', 'south' ,'west']}, {type: 'corridor', allowedExits: ['east', 'west']}, {type: 'corridor', allowedExits: ['east', 'south', 'west']}, {type: 'corridor', allowedExits: ['east', 'west']}, {type: 'corridor', allowedExits: ['south', 'west']}, null],
    // Y=4
    [null, null, null, null, {type: 'corridor', allowedExits: ['north', 'south']}, null, {type: 'corridor', allowedExits: ['north', 'south']}, null, {type: 'corridor', allowedExits: ['north', 'south']}, null],
    // Y=5
    [{type: 'circle1', allowedExits: ['east', 'south']}, {type: 'corridor', allowedExits: ['east', 'west']}, {type: 'corridor', allowedExits: ['south', 'west']}, null, {type: 'corridor', allowedExits: ['north', 'south']}, null, {type: 'whimpering', npc: 'whimpering_man', allowedExits: ['north', 'south']}, {type: 'puzzle', allowedExits: ['east']}, {type: 'corridor', allowedExits: ['north', 'south', 'west']}, null],
    // Y=6
    [{type: 'corridor', allowedExits: ['north', 'south']}, null, {type: 'corridor', allowedExits: ['north', 'south']}, null, {type: 'corridor', allowedExits: ['north', 'south']}, null, {type: 'start', allowedExits: ['north']}, null, {type: 'locked_door', allowedExits: ['west', 'north']}, null],
    // Y=7
    [{type: 'corridor', allowedExits: ['north', 'east']}, {type: 'corridor', allowedExits: ['east', 'west']}, {type: 'corridor', allowedExits: ['north', 'east', 'west']}, {type: 'corridor', allowedExits: ['east', 'west']}, {type: 'corridor', allowedExits: ['north', 'south', 'west']}, null, null, null, {type: 'prisoner', allowedExits: ['north']}, null],
    // Y=8
    [null, null, null, null, {type: 'locked_door', allowedExits: ['north', 'south']}, null, null, null, null, null],
    // Y=9
    [null, null, null, null, {type: 'corridor', allowedExits: ['north', 'east']}, {type: 'corridor', allowedExits: ['east', 'west']}, {type: 'corridor', allowedExits: ['east', 'west']}, {type: 'end', allowedExits: [null]}, null, null]
];


/**
 * Get tile at coordinates (0-indexed)
 * @param {number} x - X coordinate (0-9)
 * @param {number} y - Y coordinate (0-9)
 * @returns {Object|null} Tile data or null if out of bounds
 */
export function getTile(x, y) {
    console.log(`Getting tile at (${x}, ${y})`);
    console.log(dungeonMap[y][x]);
    if (x < 0 || x > 9 || y < 0 || y > 9) return null;
    return dungeonMap[y][x];
}

/**
 * Check if a tile exists and is passable
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @returns {boolean} Whether tile exists
 */
export function canMoveTo(x, y) {
    const tile = getTile(x, y);
    return tile !== null && tile !== undefined;
}

/**
 * Check if a direction is allowed from a tile
 * @param {number} x - Current X
 * @param {number} y - Current Y
 * @param {string} direction - Direction to check
 * @returns {boolean} Whether movement is allowed
 */
export function isDirectionAllowed(x, y, direction) {
    const tile = getTile(x, y);
    if (!tile || !tile.allowedExits) return false;
    return tile.allowedExits.includes(direction);
}

/**
 * Get the next coordinates for a direction
 * @param {number} x - Current X
 * @param {number} y - Current Y
 * @param {string} direction - Direction to move
 * @returns {Object|null} {x, y} of next tile or null
 */
export function getNextTile(x, y, direction) {
    const dirMap = {
        north: { x: 0, y: -1 },
        south: { x: 0, y: 1 },
        east: { x: 1, y: 0 },
        west: { x: -1, y: 0 }
    };
    
    if (!dirMap[direction]) return null;
    
    const nextX = x + dirMap[direction].x;
    const nextY = y + dirMap[direction].y;
    
    if (canMoveTo(nextX, nextY)) {
        return { x: nextX, y: nextY };
    }
    return null;
}

/**
 * Get description for a corridor tile
 * @returns {string} Random corridor description from pool of 10
 */
export function getCorridorDescription() {
    const randomIndex = Math.floor(Math.random() * corridorDescriptions.length);
    return corridorDescriptions[randomIndex];
}

/**
 * Parse tile coordinate from string format "x,y"
 * @param {string} coordString - Coordinate string
 * @returns {Object} {x, y} coordinate pair
 */
function parseCoord(coordString) {
    const [x, y] = coordString.split(',').map(Number);
    return { x, y };
}

/**
 * Generate ASCII map display showing visited tiles
 * @param {Array} visitedTiles - Array of visited tile coordinates as "x,y" strings
 * @param {Object} playerPos - Player position {x, y}
 * @returns {string} ASCII map visualization
 */
export function generateMapDisplay(visitedTiles, playerPos) {
    const lines = [];
    const width = 21; // Total width including borders
    
    lines.push('╔═══════════════════╗');
    lines.push('║    @!"£^!%"£"!    ║');
    lines.push('╠═══════════════════╣');
    
    if (visitedTiles.length === 0) {
        const content = '(unexplored)';
        const padding = ' '.repeat(Math.floor((width - 2 - content.length) / 2));
        lines.push('║' + padding + content + padding + ' ║');
        lines.push('╚═══════════════════╝');
        return lines.join('\n');
    }
    
    // Create a Set for quick lookup of visited coordinates
    const visitedSet = new Set(visitedTiles);
    
    // Build 10x10 grid
    for (let y = 0; y < 10; y++) {
        const cells = [];
        for (let x = 0; x < 10; x++) {
            const coordKey = `${x},${y}`;
            const tile = getTile(x, y);
            
            if (x === playerPos.x && y === playerPos.y) {
                cells.push('@');
            } else if (visitedSet.has(coordKey)) {
                if (!tile) {
                    cells.push('?');
                } else {
                    switch (tile.type) {
                        case 'start': cells.push('S'); break;
                        case 'end': cells.push('E'); break;
                        case 'merchant': cells.push('M'); break;
                        case 'prisoner': cells.push('P'); break;
                        case 'whimpering': cells.push('W'); break;
                        case 'puzzle': cells.push('?'); break;
                        case 'locked_door': cells.push('#'); break;
                        case 'circle1':
                        case 'circle2': cells.push('O'); break;
                        case 'para': cells.push('X'); break;
                        case 'corridor': cells.push('·'); break;
                        default: cells.push('·'); break;
                    }
                }
            } else {
                cells.push(' ');
            }
        }
        // Create row with exactly 19 characters of content (10 symbols + 9 spaces between)
        const content = cells.join(' ');
        lines.push('║' + content + '║');
    }
    
    lines.push('╚═══════════════════╝');
    
    return lines.join('\n');
}

/**
 * Update the map display in the UI.
 * This function will be called with game state from gameState.js
 * @param {Array} visitedTiles - Array of visited coordinates
 * @param {Object} playerPos - Current player position {x, y}
 */
export function updateMapDisplay(visitedTiles = [], playerPos = {x: 6, y: 6}) {
    const mapContent = document.querySelector('#mapPanel .map-content');
    if (!mapContent) return;
    
    const mapText = generateMapDisplay(visitedTiles, playerPos);
    mapContent.innerHTML = `<pre class="ascii-map updating">${mapText}</pre>`;
    
    // Remove animation class after animation completes
    const mapElement = mapContent.querySelector('.ascii-map');
    if (mapElement) {
        setTimeout(() => mapElement.classList.remove('updating'), 400);
    }
}
