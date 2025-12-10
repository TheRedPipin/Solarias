/**
 * COMMANDS MODULE
 * Handles user command input, processing, and history management.
 * Creates a command controller with keyboard navigation and history tracking.
 */

import { CommandType } from './state.js';
import { addMessage } from './ui.js';
import { parseCommand } from '../game/parser.js';

/**
 * Create a command controller with history and keyboard handling.
 * Maintains command history with arrow key navigation.
 * @param {Object} elements - DOM element references
 * @returns {Object} Object with handleKeydown and handleSubmit functions
 */
export function createCommandController(elements) {
    // Command history stored newest-first
    const commandHistory = [];
    let historyIndex = -1;  // Current position in history (-1 = not navigating)
    const MAX_HISTORY = 50; // Maximum commands to remember

    /**
     * Process a user command and add to history.
     * Parses the command and executes game logic.
     * @param {string} command - The command text
     * @param {string} type - Command type (Do/Say)
     */
    function processCommand(command, type) {
        if (!command.trim()) return;

        // Add to history (newest first)
        commandHistory.unshift(command);
        if (commandHistory.length > MAX_HISTORY) {
            commandHistory.pop(); // Remove oldest
        }
        historyIndex = -1; // Reset history navigation

        // Echo command to description panel
        addMessage(elements, `> ${type}: ${command}`, 'command-echo');

        // Parse and execute the command
        const response = parseCommand(command, type);
        addMessage(elements, response, 'system-message');
    }

    /**
     * Handle command submission from input field.
     * Processes the command and clears the input.
     */
    function handleSubmit() {
        const command = elements.promptBox.value.trim();
        const type = elements.typeBtn.textContent || CommandType.DO;

        if (command) {
            processCommand(command, type);
            elements.promptBox.value = ''; // Clear input
        }

        elements.promptBox.focus(); // Keep focus for next command
    }

    /**
     * Navigate through command history.
     * @param {number} direction - 1 for older (up arrow), -1 for newer (down arrow)
     */
    function navigateHistory(direction) {
        if (commandHistory.length === 0) return;

        // Move through history
        historyIndex += direction;
        // Clamp to valid range: -1 (empty) to length-1 (oldest)
        historyIndex = Math.max(-1, Math.min(historyIndex, commandHistory.length - 1));

        if (historyIndex === -1) {
            // Back to empty input
            elements.promptBox.value = '';
        } else {
            // Load command from history
            elements.promptBox.value = commandHistory[historyIndex];
        }
    }

    /**
     * Handle keyboard input for command entry.
     * Enter: Submit command
     * Up/Down arrows: Navigate history
     * @param {KeyboardEvent} event - The keyboard event
     */
    function handleKeydown(event) {
        switch (event.key) {
            case 'Enter':
                event.preventDefault();
                handleSubmit();
                break;
            case 'ArrowUp':
                event.preventDefault();
                navigateHistory(1); // Go to older command
                break;
            case 'ArrowDown':
                event.preventDefault();
                navigateHistory(-1); // Go to newer command
                break;
        }
    }

    // Return public API
    return {
        handleKeydown,
        handleSubmit
    };
}
