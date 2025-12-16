import { CommandType, loadSettings, saveSettings, SETTINGS_KEY } from './modules/core/state.js';
import { initElements, toggleCommandType, addMessage, displayGoalText, applySettings, loadViewImage } from './modules/core/ui.js';
import { createCommandController } from './modules/core/commands.js';
import { setupSettingsControls } from './modules/core/settings.js';
import { setMapUpdater, setPlayerInfoUpdater, gameState } from './modules/game/gameState.js';
import { updateMapDisplay } from './modules/game/map.js';
import { updatePlayerInfo } from './modules/core/playerInfo.js';

function init() {
    // Initialize and validate DOM elements
    const elements = initElements();
    if (!elements) return; // Abort if required elements missing

    // Load saved settings from localStorage (or defaults)
    let settings = loadSettings();

    // Get references to settings controls and audio elements
    const ambienceAudio = document.getElementById('ambienceAudio');
    const breathingAudio = document.getElementById('breathingAudio');
    const settingsBtn = document.getElementById('settingsBtn');
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeValue = document.getElementById('volumeValue');
    const ambienceToggle = document.getElementById('ambienceToggle');
    const resetBtn = document.getElementById('resetBtn');

    // Apply saved settings to UI and audio
    const controls = { ambienceAudio, breathingAudio, volumeSlider, volumeValue, ambienceToggle };
    applySettings(settings, controls);

    // Show goal text animation on startup
    displayGoalText('Find the sun...');
    
    // Set initial command type to "Do"
    elements.typeBtn.textContent = CommandType.DO;

    // Create command controller and get keyboard handler
    const { handleKeydown } = createCommandController(elements);

    // Wire up command type toggle button
    elements.typeBtn.addEventListener('click', () => toggleCommandType(elements));
    
    // Wire up command input keyboard handling
    elements.promptBox.addEventListener('keydown', handleKeydown);

    // Set up settings modal and controls
    setupSettingsControls({
        settingsBtn,
        closeSettingsBtn,
        settingsModal,
        volumeSlider,
        ambienceToggle,
        resetBtn,
        settings,
        // Callback when settings change: update UI, audio, and save
        onSettingsChange: (nextSettings) => {
            settings = nextSettings;
            applySettings(settings, controls);
            saveSettings(settings);
        }
    });

    // Initialize map and player info updaters
    setMapUpdater(updateMapDisplay);
    setPlayerInfoUpdater(updatePlayerInfo);
    
    // Load starting tile after goal text animation completes
    setTimeout(() => {
        // Mark starting position as visited
        gameState.flags.visited_tiles = ['6,6'];
        
        // Load starting room image
        loadViewImage('assets/images/corridor.png', 'Starting Cell');
        
        // Initialize displays
        updateMapDisplay();
        updatePlayerInfo();
        // Start Displaying System Messages
        addMessage(elements, '> SYSTEM INITIALIZING...', 'system-message');
        addMessage(elements, '> CONNECTION ESTABLISHED', 'system-message');
        addMessage(elements, '', 'system-message');
        addMessage(elements, 'Type HELP for commands.', 'system-message');
        // Focus input for immediate typing
        elements.promptBox.focus();
    }, 4300);
}

// Bootstrap when DOM is ready
document.addEventListener('DOMContentLoaded', init);
