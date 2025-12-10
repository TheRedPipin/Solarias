/**
 * PLAYER INFO MODULE
 * Displays player status, inventory, and body parts in the UI.
 */

import { gameState } from '../game/gameState.js';

/**
 * Update the player info panel display.
 */
export function updatePlayerInfo() {
    const playerInfoDiv = document.getElementById('playerName');
    if (!playerInfoDiv) return;
    
    let info = '<div class="player-stats">';
    
    // Body parts
    info += '<div class="stat-line">Hands: ' + gameState.bodyParts.hands + '</div>';
    info += '<div class="stat-line">Feet: ' + gameState.bodyParts.feet + '</div>';
    info += '<div class="stat-divider">─────────</div>';
    
    // Inventory
    if (gameState.inventory.length > 0) {
        gameState.inventory.forEach(item => {
            const itemName = item.replace(/_/g, ' ');
            info += '<div class="stat-line">• ' + itemName + '</div>';
        });
    } else {
        info += '<div class="stat-line">Empty...</div>';
    }
    
    info += '</div>';
    
    playerInfoDiv.innerHTML = info;
}
