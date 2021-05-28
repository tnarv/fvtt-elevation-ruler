import { registerSettings, registerHotkeys } from "./settings.js";
import { registerRuler } from "./patching.js";

export const MODULE_ID = 'elevation-ruler';
const FORCE_DEBUG = false; // used for logging before dev mode is set up


export function log(...args) {
  try {
    const isDebugging = window.DEV?.getPackageDebugValue(MODULE_ID);
    //console.log(MODULE_ID, '|', `isDebugging: ${isDebugging}.`);

    if (FORCE_DEBUG || isDebugging) {
      console.log(MODULE_ID, '|', ...args);
    }
  } catch (e) {}
}

// https://discord.com/channels/732325252788387980/754127569246355477/819710580784234506
// init is called almost immediately after the page loads. 
// At this point, the game global exists, but hasn't yet been initialized, 
// but all of the core foundry code has been loaded.
Hooks.once('init', async function() {
  log("Initializing Elevation Ruler Options.");
  
});

// setup is after init; before ready. 
// setup is called after settings and localization have been initialized, 
// but before entities, packs, UI, canvas, etc. has been initialized
Hooks.once('setup', async function() {
  log("Setup.");
  if(!game.modules.get('lib-wrapper')?.active && game.user.isGM) ui.notifications.error("'Elevation Ruler' requires the 'libWrapper' module. Please install and activate this dependency.");
  if(!game.modules.get('lib-df-hotkeys')?.active && game.user.isGM) ui.notifications.error("'Elevation Ruler' requires the 'Library: DF Hotkeys' module. Please install and activate this dependency.");
  if(!game.modules.get('lib-ruler')?.active && game.user.isGM) ui.notifications.error("'Elevation Ruler' requires the 'libRuler' module. Please install and activate this dependency.");

  
  registerHotkeys(); // should go before registering settings, so hotkey group is defined
  registerSettings();
});

// modules ready
// ready is called once everything is loaded up and ready to go.
Hooks.once('ready', async function() {
  log("Readying.");
});

// https://github.com/League-of-Foundry-Developers/foundryvtt-devMode
Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
  registerPackageDebugFlag(MODULE_ID);
});

Hooks.once('libRulerReady', async function() {
  log("libRuler is ready to go.");
  registerRuler();
 
  // tell modules that the elevationRuler is set up
  Hooks.callAll('elevationRulerReady');

});

