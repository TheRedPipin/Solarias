/**
 * COMMAND PARSER MODULE
 * Interprets player commands and executes game actions.
 * Now uses tile-based coordinate system.
 */

import { gameState, hasItem, addItem, removeItem, moveToTile, getCurrentPosition, triggerPlayerInfoUpdate } from './gameState.js';
import { getTile, getNextTile, getExits } from './map.js';
import { npcs } from './npcs.js';
import { loadViewImage } from '../core/ui.js';

/**
 * Parse and execute a player command.
 */
export function parseCommand(input, type) {
    const cmd = input.toLowerCase().trim();
    const currentTile = getTile(gameState.x, gameState.y);
    
    if (cmd === 'help' || cmd === '?') {
        return getHelpText();
    }
    
    if (cmd.startsWith('go ') || cmd.startsWith('move ') || ['north', 'south', 'east', 'west', 'n', 's', 'e', 'w'].includes(cmd)) {
        return handleMovement(cmd);
    }
    
    if (cmd.startsWith('look') || cmd.startsWith('examine') || cmd === 'l') {
        return handleLook(currentTile);
    }
    
    if (cmd === 'inventory' || cmd === 'i' || cmd === 'inv') {
        return showInventory();
    }
    
    if (cmd.startsWith('take ') || cmd.startsWith('get ')) {
        return handleTake(cmd, currentTile);
    }
    
    if (cmd.startsWith('use ')) {
        return handleUse(cmd, currentTile);
    }
    
    if (type === 'Say' || cmd.startsWith('talk ') || cmd.startsWith('speak ')) {
        return handleSpeech(input, type, currentTile);
    }
    
    if (cmd.startsWith('give ')) {
        return handleGive(cmd, currentTile);
    }
    
    if (cmd.startsWith('buy ')) {
        return handleBuy(cmd, currentTile);
    }

    return "I don't understand that command. Type HELP for a list of commands.";
}

function getHelpText() {
    return `
    Available Commands:

    MOVEMENT:
    GO [direction] / [N/S/E/W] - Move in a direction
    
    INTERACTION:
    LOOK / EXAMINE - Look around
    TAKE [item] - Pick up an item
    USE [item] - Use an item
    TALK TO [person] - Speak with someone
    GIVE [item] TO [person] - Give an item
    BUY [item] - Purchase from merchant
    
    OTHER:
    INVENTORY / I - Check items
    HELP - Show this help text
  `;
}

function handleMovement(cmd) {
    let direction = cmd.replace(/^(go|move)\s+/, '');
    const dirMap = { n: 'north', s: 'south', e: 'east', w: 'west' };
    direction = dirMap[direction] || direction;
    const nextCoords = getNextTile(gameState.x, gameState.y, direction);
    // Check if direction is allowed from this tile
    if (!nextCoords) {
        return "You can't go that way. The passage is blocked by stone.";
    }
    const nextTile = getTile(nextCoords.x, nextCoords.y);
    // Check if next tile is a locked door without skeleton key
    if (nextTile && nextTile.type === 'locked_door' && !hasItem('skeleton_key')) {
        // Don't move the player, just show the blocked message
        return "A heavy door blocks your path, bound with chains. You need a key to proceed.";
    }
    // Handle circle teleportation
    else if (nextTile && nextTile.type === 'circle1') {
        moveToTile(0, 3); // Teleport to circle2
        nextTile = getTile(0, 3);
        loadViewImage('./assets/images/corridor.png', 'Corridor', false, true);
        const description = nextTile.description;
        const exitsText = getExitsText();
        return `You move ${direction}.\n\nYour body becomes light before quickly returning to normal...\n\n${description}\n\n${exitsText}`;
    }
    else if (nextTile && nextTile.type === 'circle2') {
        moveToTile(0, 5); // Teleport to circle1
        nextTile = getTile(0, 5);
        loadViewImage('./assets/images/corridor.png', 'Corridor', false, true);
        const description = nextTile.description;
        const exitsText = getExitsText();
        return `You move ${direction}.\n\nYour body becomes light before quickly returning to normal...\n\n${description}\n\n${exitsText}`;
    }
    // Load appropriate image based on tile type
    if (nextTile) {
        switch (nextTile.type) {
            case 'whimpering':
                loadViewImage('./assets/images/whimpering.png', 'Whimpering Chamber', true, true);
                break;
            case 'locked_door':
                loadViewImage('./assets/images/lockedDoor.png', 'Sealed Door', true, true);
                break;
            case 'para':
                loadViewImage('./assets/images/deadend.png', 'Dead End', true, true);
                break;
            case 'puzzle':
                if (gameState.flags.puzzle_solved) {
                    loadViewImage('./assets/images/sacrificeAfter.png', 'Sacrificial Chamber', true, true);
                } else {
                    loadViewImage('./assets/images/sacrificeBefore.png', 'Sacrificial Chamber', true, true);
                }
                break;
            default:
                loadViewImage('./assets/images/corridor.png', 'Corridor', false, true);
                break;
        }
    }
    
    // Get description for new tile
    const description = nextTile.description;
    moveToTile(nextCoords.x, nextCoords.y);
    const exitsText = getExitsText();
    return `You move ${direction}.\n\n${description}\n\n${exitsText}`;
}

function handleLook(currentTile) {
    const description = currentTile.description;
    const exitsText = getExitsText();
    
    return `${description}\n\n${exitsText}`;
}

function getExitsText() {
    const directionExits = getExits(gameState.x, gameState.y);
    if (!directionExits) return "You can go: nowhere";
    
    const arrows = {
        north: '↑',
        south: '↓',
        east: '→',
        west: '←'
    };

    for (let i = 0; i < directionExits.length; i++) {
        directionExits[i] = `${directionExits[i].charAt(0).toUpperCase() + directionExits[i].slice(1)} ${arrows[directionExits[i]]}`;
    }
    
    return `You can go: ${directionExits}`;
}

function showInventory() {
    if (gameState.inventory.length === 0) {
        return `You carry nothing but dread.\n\nBody Parts: ${gameState.bodyParts.hands} hands, ${gameState.bodyParts.feet} feet`;
    }
    return `Inventory: ${gameState.inventory.join(', ')}\n\nBody Parts: ${gameState.bodyParts.hands} hands, ${gameState.bodyParts.feet} feet`;
}

function handleTake(cmd, currentTile) {
    if (currentTile && currentTile.type === 'puzzle') {
        const item = cmd.replace(/^(take|get)\s+/, '');
        if (item.includes('bone') || item.includes('saw')) {
            if (hasItem('bone_saw')) {
                return "You already have that.";
            }
            addItem('bone_saw');
            return "You take the bone saw. It's heavier than it looks.";
        }
    }
    return "There's nothing to take here.";
}

/**
 * Handle speech: both direct "Say" commands and "Talk To" interactions.
 * @param {string} input - The speech/command input
 * @param {string} type - Command type ('Say' or 'Do')
 * @param {Object} currentTile - Current tile
 * @returns {string} Response from NPC or echo
 */
function handleSpeech(input, type, currentTile) {
    // Extract actual speech (remove 'talk to' / 'speak to' if present)
    let speech = input;
    if (type === 'Do') {
        speech = input.replace(/^(talk|speak)\s+(to\s+)?/i, '');
    }
    
    // If no NPC here, speech echoes unanswered
    if (!currentTile || !currentTile.npc) {
        return `You say: "${speech}"\n\nYour words echo unanswered.`;
    }
    
    // Talk to NPC
    const npc = npcs[currentTile.npc];
    if (!npc || !npc.dialogue) {
        return `You say: "${speech}"\n\nThey don't respond.`;
    }
    
    // Handle merchant-specific speech
    if (currentTile.npc === 'merchant') {
        // Check if speech contains buy commands
        const lowerSpeech = speech.toLowerCase();
        if (lowerSpeech.includes('glow') && lowerSpeech.includes('bug')) {
            return npc.buyGlowBug();
        }
        if (lowerSpeech.includes('skeleton') && lowerSpeech.includes('key')) {
            return npc.buySkeletonKey();
        }
        if (lowerSpeech.includes('what') || lowerSpeech.includes('sell') || lowerSpeech.includes('buy')) {
            return npc.dialogue.menu
        }
        return npc.getGreeting();
    }
    
    // Handle whimpering man
    if (currentTile.npc === 'whimpering_man') {
        return npc.trade();
    }
    
    // Handle prisoner
    if (currentTile.npc === 'prisoner') {
        return npc.trade();
    }
    
    return npc.dialogue.default;
}

function handleGive(cmd, currentTile) {
    if (!currentTile || !currentTile.npc) {
        return "There's no one here.";
    }
    return "They don't want that.";
}

function handleBuy(cmd, currentTile) {
    if (!currentTile || currentTile.type !== 'merchant') {
        return "There's nothing to buy here.";
    }
    
    const npc = npcs[currentTile.npc];
    if (!npc) return "The merchant stares at you expectantly.";
    
    const item = cmd.replace(/^buy\s+/, '').toLowerCase();
    
    if (item.includes('glow') && item.includes('bug')) {
        return npc.buyGlowBug();
    }
    if (item.includes('skeleton') && item.includes('key')) {
        return npc.buySkeletonKey();
    }
    
    return npc.getGreeting();
}

function handleUse(cmd, currentTile) {
    const item = cmd.replace(/^use\s+/, '');
    
    // Handle puzzle room interactions
    if (currentTile && currentTile.type === 'puzzle') {
        const lowerInput = cmd.toLowerCase();
        if (lowerInput.includes('pedestal') || lowerInput.includes('blade') || lowerInput.includes('touch') || lowerInput.includes('press')) {
            if (!gameState.flags.puzzle_solved) {
                gameState.flags.puzzle_solved = true;
                loadViewImage('./assets/images/sacrificeAfter.png', 'Sacrificial Chamber', true, true);
            }
            return "Your hand touches the weathered blade atop the pedestal.\n\nThe moment your skin makes contact, the blade shifts, stabbing into you. Blood wells from your fingers.\n\nYour blood drips onto the stone. A low grinding sound echoes through the chamber as a hidden drawer slides open from the pedestal's base, revealing a bone saw within.";
        }
    }
    
    if (!hasItem(item)) {
        return "You don't have that.";
    }
    return "You're not sure how to use that here.";
}
