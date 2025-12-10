/**
 * NPCS MODULE
 * Defines NPC dialogue, behaviors, and trade mechanics.
 * Handles interactions with the whimpering man, merchant, and prisoner.
 */

import { gameState, hasItem, addItem, removeItem, triggerPlayerInfoUpdate } from './gameState.js';

export const npcs = {
    whimpering_man: {
        name: "Whimpering Man",
        description: "A hunched figure rocks back and forth, sobbing quietly. He won't look at you.",
        dialogue: {
            default: "...*sob*... *sob*...",
            no_jar: "The man reaches out desperately, but you have nothing to give.",
            give_jar: "The man snatches the jar from your hands. Tears stream down his face, filling it slowly. He hands it back without a word. His sobbing continues."
        },
        canTrade: () => hasItem('jar'),
        trade: () => {
            if (hasItem('jar')) {
                removeItem('jar');
                addItem('jar_of_tears');
                gameState.flags.whimpering_man_helped = true;
                return npcs.whimpering_man.dialogue.give_jar;
            }
            return npcs.whimpering_man.dialogue.no_jar;
        }
    },
    
    merchant: {
        name: "The Merchant",
        description: "The merchant's smile never reaches his eyes. 'Everything has a price,' he whispers.",
        dialogue: {
            greeting: "Welcome, welcome! I have such wonders to sell.",
            no_saw: "Ah, but you'll need a bone saw first. For the cutting, you understand.",
            menu: "I offer:\n- GLOW BUG (costs: 1 hand)\n- SKELETON KEY (costs: 1 foot)\n\nWhat would you like? (Try: BUY GLOW BUG or BUY SKELETON KEY)",
            buy_glowbug_success: "The merchant produces a pale insect pulsing with sickly light. He holds out his hand expectantly.\n\nYou hear sawing. You try not to scream. When you can see again, the glow bug is yours.\n\n[You lost 1 hand]",
            buy_key_success: "A rusted skeleton key appears on the table. The merchant gestures to your feet.\n\nThe saw bites. You fall. When the pain fades, you clutch the key in bloody fingers.\n\n[You lost 1 foot]",
            no_hands: "You don't have enough hands for that.",
            no_feet: "You don't have enough feet for that.",
            already_own: "You already have that.",
            default: "*The man hums as he saws away at something*"
        },
        getGreeting: () => {
            if (!gameState.flags.merchant_greeted) {
                gameState.flags.merchant_greeted = true;
                return npcs.merchant.dialogue.greeting;
            }
            return npcs.merchant.dialogue.default;
        },
        canTrade: () => hasItem('bone_saw'),
        buyGlowBug: () => {
            if (!hasItem('bone_saw')) {
                return npcs.merchant.dialogue.no_saw;
            }
            if (hasItem('glow_bug')) {
                return npcs.merchant.dialogue.already_own;
            }
            if (gameState.bodyParts.hands > 0) {
                gameState.bodyParts.hands--;
                addItem('glow_bug');
                triggerPlayerInfoUpdate();
                return npcs.merchant.dialogue.buy_glowbug_success;
            }
            return npcs.merchant.dialogue.no_hands;
        },
        buySkeletonKey: () => {
            if (!hasItem('bone_saw')) {
                return npcs.merchant.dialogue.no_saw;
            }
            if (hasItem('skeleton_key')) {
                return npcs.merchant.dialogue.already_own;
            }
            if (gameState.bodyParts.feet > 0) {
                gameState.bodyParts.feet--;
                addItem('skeleton_key');
                triggerPlayerInfoUpdate();
                return npcs.merchant.dialogue.buy_key_success;
            }
            return npcs.merchant.dialogue.no_feet;
        }
    },
    
    prisoner: {
        name: "The Prisoner",
        description: "A broken figure sits motionless. Their eyes are hollow, but they still breathe.",
        dialogue: {
            default: "I've been here so long... I don't remember the sun. Do you? Do you remember warmth?",
            with_glowbug: "Is that... light? Real light? Please. Please, I'll give you anything. Here, take this. I've kept it safe, but I don't need it anymore.\n\n[The prisoner gives you a jar]",
            after_trade: "Thank you. Thank you. At least now I can see the walls that cage me.",
            no_glowbug: "The prisoner stares through you. They have nothing left to give."
        },
        canTrade: () => hasItem('glow_bug') && !gameState.flags.prisoner_helped,
        trade: () => {
            if (hasItem('glow_bug') && !gameState.flags.prisoner_helped) {
                removeItem('glow_bug');
                addItem('jar');
                gameState.flags.prisoner_helped = true;
                return npcs.prisoner.dialogue.with_glowbug;
            }
            if (gameState.flags.prisoner_helped) {
                return npcs.prisoner.dialogue.after_trade;
            }
            return npcs.prisoner.dialogue.no_glowbug;
        }
    }
};
