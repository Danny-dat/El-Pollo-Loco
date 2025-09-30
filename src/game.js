// src/game.js
(function (Game) {
  'use strict';

  /** @type {HTMLCanvasElement} */
  let canvas;

  /** @type {Game.World} */
  let world;

  /** Eingaben (früher "Keyboard") */
  const keyboard = new Game.Input();

  /** Ton-Status (false = Sound an) */
  let isMuted = false;

  /**
   * Initialisiert das UI/Canvas, lädt Mute-Status aus LocalStorage.
   */
  function init() {
    canvas = document.getElementById('canvas');

    // Mute-Status aus dem Storage ziehen (string -> boolean)
    isMuted = localStorage.getItem('isGameMuted') === 'true';
    updateVolumeIcon();
    checkOrientation();
  }

  /**
   * Startet das Spiel: Startscreen ausblenden, Level & World initialisieren.
   */
  function start() {
    const startPolloLoco = document.getElementById('startPolloLoco');
    if (startPolloLoco) startPolloLoco.style.display = 'none';

    closInfo();

    // Falls deine Level-Initialisierung global ist, so belassen:
    if (typeof initLevel === 'function') {
      initLevel();
    } else if (typeof Game.initLevel === 'function') {
      Game.initLevel();
    }

    mobilRun();

    world = new Game.World(canvas, keyboard);
    window.world = world;
    Game.world = world;
    world.sound = !isMuted; // Soundzustand anwenden
  }

  /**
   * Mute umschalten, speichern und Icon aktualisieren.
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
   * Icon entsprechend Mute-Status setzen.
   */
  function updateVolumeIcon() {
    const volumeIcon = document.getElementById('volume');
    if (!volumeIcon) return;

    volumeIcon.src = isMuted ? 'assets/stumm.png' : 'assets/lautsprecher.png';
  }

  /**
   * Komplett neu laden.
   */
  function reStart() {
    window.location.reload();
  }

  /**
   * „Soft“ neu starten (Intervals killen, wieder starten).
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
   * Alle Intervals grob beenden.
   */
  function clearAllIntervals() {
    for (let i = 1; i < 9999; i++) window.clearInterval(i);
  }

  /**
   * Info-Hinweis verbergen.
   */
  function closInfo() {
    const n = document.getElementById('infoNote');
    if (n) n.style.display = 'none';
  }

  /**
   * Info-Hinweis umschalten.
   */
  function infoNote() {
    const n = document.getElementById('infoNote');
    if (!n) return;
    n.style.display = n.style.display === 'flex' ? 'none' : 'flex';
  }

  /**
   * Touch-Controls für Mobile.
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
   * Quer/Hochformat prüfen und UI anpassen.
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

  // Tastatur-Events (classic keyCode beibehalten)
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

  // Init nach DOM-Load & Größenwechsel beobachten
  window.addEventListener('DOMContentLoaded', init);
  window.addEventListener('resize', checkOrientation);

  // --- Funktionen für onclick in HTML global verfügbar machen ---
  window.start = start;
  window.volume = volume;
  window.infoNote = infoNote;
  window.restartGame = restartGame;
  window.reStart = reStart;

})(window.Game);
