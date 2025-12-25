import { CommandType } from './state.js';
import { addMessage } from './ui.js';
import { parseCommand } from '../game/parser.js';

export function createCommandController(elements) {
    function processCommand(command) {
        if (!command.trim() || document.getElementsByClassName("goal-text").length !== 0) return;
        elements.descPanel.innerHTML = "";
        addMessage(elements, `> DO: ${command}`, 'command-echo');
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
                processCommand("North", CommandType.DO)
                break;
            case 'ArrowDown':
                processCommand("South", CommandType.DO)
                break;
            case 'ArrowRight':
                processCommand("East", CommandType.DO)
                break;
            case 'ArrowLeft':
                processCommand("West", CommandType.DO)
                break;
        }
    }

    return {
        handleKeydown,
        handleSubmit
    };
}
