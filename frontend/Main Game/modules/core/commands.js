import { CommandType } from './state.js';
import { addMessage } from './ui.js';
import { parseCommand } from '../game/parser.js';

export function createCommandController(elements) {
    function processCommand(command, type) {
        if (!command.trim()) return;
        elements.descPanel.innerHTML = "";
        addMessage(elements, `> ${type}: ${command}`, 'command-echo');
        const response = parseCommand(command, type);
        addMessage(elements, response, 'system-message');
    }

    function handleSubmit() {
        const command = elements.promptBox.value.trim();
        const type = elements.typeBtn.textContent || CommandType.DO;

        if (command) {
            processCommand(command, type);
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
