/**
 * GAME STATE MODULE
 * Manages player inventory, location, and game progression.
 * Uses coordinate-based tile system (0-9 x and y).
 */

// Global game state
export const gameState = {
    x: 6,           // Player X coordinate (0-9)
    y: 6,           // Player Y coordinate (0-9)
    inventory: [],
    bodyParts: {
        hands: 2,
        feet: 2
    },
    flags: {
        whimpering_man_helped: false,
        merchant_met: false,
        prisoner_helped: false,
        puzzle_solved: false,
        breathing_encountered: false,
        visited_tiles: []  // Track visited tile coordinates
    }
};

/**
 * Add an item to player inventory.
 * @param {string} item - Item name to add
 */
export function addItem(item) {
    if (!gameState.inventory.includes(item)) {
        gameState.inventory.push(item);
        updatePlayerInfo();
    }
}

/**
 * Update player info display (will be set during initialization).
 */
let updatePlayerInfo = () => {};

/**
 * Remove an item from inventory.
 * @param {string} item - Item name to remove
 * @returns {boolean} True if item was removed
 */
export function removeItem(item) {
    const index = gameState.inventory.indexOf(item);
    if (index > -1) {
        gameState.inventory.splice(index, 1);
        updatePlayerInfo();
        return true;
    }
    return false;
}

/**
 * Check if player has an item.
 * @param {string} item - Item name to check
 * @returns {boolean} True if player has the item
 */
export function hasItem(item) {
    return gameState.inventory.includes(item);
}

/**
 * Trigger player info update when body parts change.
 */
export function triggerPlayerInfoUpdate() {
    updatePlayerInfo();
}

/**
 * Move player to new coordinates.
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 */
export function moveToTile(x, y) {
    gameState.x = x;
    gameState.y = y;
    
    // Mark as visited for map
    const key = `${x},${y}`;
    if (!gameState.flags.visited_tiles.includes(key)) {
        gameState.flags.visited_tiles.push(key);
    }
    
    // Update map display with visited tiles and current position
    updateMapDisplay(gameState.flags.visited_tiles, { x: gameState.x, y: gameState.y });
}

/**
 * Update map display (will be set during initialization).
 */
let updateMapDisplay = () => {};

/**
 * Set the map update function.
 * @param {Function} fn - The updateMapDisplay function
 */
export function setMapUpdater(fn) {
    updateMapDisplay = fn;
}

/**
 * Set the player info update function.
 * @param {Function} fn - The updatePlayerInfo function
 */
export function setPlayerInfoUpdater(fn) {
    updatePlayerInfo = fn;
}

/**
 * Get current player position.
 * @returns {Object} {x, y} coordinates
 */
export function getCurrentPosition() {
    return { x: gameState.x, y: gameState.y };
}

/**
 * Reset game state to initial values.
 */
export function resetGameState() {
    gameState.x = 6;
    gameState.y = 6;
    gameState.inventory = [];
    gameState.bodyParts = { hands: 2, feet: 2 };
    gameState.flags = {
        whimpering_man_helped: false,
        merchant_met: false,
        prisoner_helped: false,
        puzzle_solved: false,
        breathing_encountered: false,
        visited_tiles: ['6,6']  // Start position is visited
    };
}

