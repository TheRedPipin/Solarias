import { addMessage } from './ui.js';
import { parseCommand } from '../game/parser.js';

export function createCommandController(elements) {
    function processCommand(command) {
        if (!command.trim() || document.getElementsByClassName("goal-text").length !== 0) return;
        elements.descPanel.innerHTML = "";
        addMessage(elements, `> YOU: ${command}`, 'command-echo');
        const response = parseCommand(command);
        addMessage(elements, response, 'system-message');
    }

    function handleSubmit() {
        const command = elements.promptBox.value.trim();

        if (command) {
            processCommand(command);
            elements.promptBox.value = '';
        }

        elements.promptBox.focus();
    }

    function handleKeydown(event) {
        switch (event.key) {
            case 'Enter':
                event.preventDefault();
                handleSubmit();
                break;
            case 'ArrowUp':
                processCommand("Go North")
                break;
            case 'ArrowDown':
                processCommand("Go South")
                break;
            case 'ArrowRight':
                processCommand("Go East")
                break;
            case 'ArrowLeft':
                processCommand("Go West")
                break;
        }
    }

    return {
        handleKeydown,
        handleSubmit
    };
}
