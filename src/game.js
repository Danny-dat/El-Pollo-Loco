// src/game.js
(function (Game) {
  'use strict';

  /** @type {HTMLCanvasElement} */
  let canvas;

  /** @type {Game.World} */
  let world;

  /** Inputs (formerly "Keyboard") */
  const keyboard = new Game.Input();

  /** Sound status (false = sound on) */
  let isMuted = false;

  /**
   * Initializes the UI/canvas, loads mute status from LocalStorage.
   */
  function init() {
    canvas = document.getElementById('canvas');

    // Load mute status from storage (string -> boolean)
    isMuted = localStorage.getItem('isGameMuted') === 'true';
    updateVolumeIcon();
    checkOrientation();
  }

  /**
   * Starts the game: hides the start screen, initializes level & world.
   */
  function start() {
    const startPolloLoco = document.getElementById('startPolloLoco');
    if (startPolloLoco) startPolloLoco.style.display = 'none';

    closInfo();

    // If your level initialization is global, leave it as is:
    if (typeof initLevel === 'function') {
      initLevel();
    } else if (typeof Game.initLevel === 'function') {
      Game.initLevel();
    }

    mobilRun();

    world = new Game.World(canvas, keyboard);
    window.world = world;
    Game.world = world;
    world.sound = !isMuted; // Apply sound state
  }

  /**
   * Toggle mute, save state, and update the icon.
   */
  function volume() {
    isMuted = !isMuted;
    localStorage.setItem('isGameMuted', isMuted);

    if (world) {
      world.sound = !isMuted;
    }
    updateVolumeIcon();
  }

  /**
   * Set icon according to mute status.
   */
  function updateVolumeIcon() {
    const volumeIcon = document.getElementById('volume');
    if (!volumeIcon) return;

    volumeIcon.src = isMuted ? 'assets/stumm.png' : 'assets/lautsprecher.png';
  }

  /**
   * Fully reload.
   */
  function reStart() {
    window.location.reload();
  }

  /**
   * “Soft” restart (kill intervals, then restart).
   */
  function restartGame() {
    const next = document.getElementById('nextLevel');
    const over = document.getElementById('gameOver');
    if (next) next.style.display = 'none';
    if (over) over.style.display = 'none';
    clearAllIntervals();
    start();
  }

  /**
   * Roughly clear all intervals.
   */
  function clearAllIntervals() {
    for (let i = 1; i < 9999; i++) window.clearInterval(i);
  }

  /**
   * Hide info note.
   */
  function closInfo() {
    const n = document.getElementById('infoNote');
    if (n) n.style.display = 'none';
  }

  /**
   * Toggle info note.
   */
  function infoNote() {
    const n = document.getElementById('infoNote');
    if (!n) return;
    n.style.display = n.style.display === 'flex' ? 'none' : 'flex';
  }

  /**
   * Touch controls for mobile.
   */
  function mobilRun() {
    const bind = (id, ev, fn) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener(ev, (e) => {
        e.preventDefault();
        fn();
      });
    };

    bind('left',  'touchstart', () => (keyboard.LEFT = true));
    bind('left',  'touchend',   () => (keyboard.LEFT = false));
    bind('right', 'touchstart', () => (keyboard.RIGHT = true));
    bind('right', 'touchend',   () => (keyboard.RIGHT = false));
    bind('jump',  'touchstart', () => (keyboard.SPACE = true));
    bind('jump',  'touchend',   () => (keyboard.SPACE = false));
    bind('throw', 'touchstart', () => (keyboard.D = true));
    bind('throw', 'touchend',   () => (keyboard.D = false));
  }

  /**
   * Check orientation (portrait/landscape) and adjust UI.
   */
  function checkOrientation() {
    const startButton = document.getElementById('startButton');
    const handy = document.getElementById('handy');
    const mk = document.getElementById('mobileKeysNone');

    if (window.innerHeight > window.innerWidth) {
      if (handy) handy.style.display = 'block';
      if (mk) mk.style.display = 'none';
      if (startButton) startButton.style.display = 'none';
    } else {
      if (handy) handy.style.display = 'none';
      if (startButton) startButton.style.display = 'block';
      if (mk) {
      if (window.matchMedia("(any-pointer: coarse)").matches) {
        mk.style.display = 'block';
      } else {
        mk.style.display = 'none';
      }
    }
    }
  }

  // Keyboard events (keep classic keyCode)
  window.addEventListener('keydown', (e) => {
    if (e.keyCode === 39) keyboard.RIGHT = true;
    if (e.keyCode === 37) keyboard.LEFT  = true;
    if (e.keyCode === 32) keyboard.SPACE = true;
    if (e.keyCode === 68) keyboard.D     = true;
  });

  window.addEventListener('keyup', (e) => {
    if (e.keyCode === 39) keyboard.RIGHT = false;
    if (e.keyCode === 37) keyboard.LEFT  = false;
    if (e.keyCode === 32) keyboard.SPACE = false;
    if (e.keyCode === 68) keyboard.D     = false;
  });

  // Init after DOM load & observe resize
  window.addEventListener('DOMContentLoaded', init);
  window.addEventListener('resize', checkOrientation);

  // --- Make functions available for onclick in HTML ---
  window.start = start;
  window.volume = volume;
  window.infoNote = infoNote;
  window.restartGame = restartGame;
  window.reStart = reStart;

})(window.Game);
