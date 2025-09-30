// src/core/world.js
(function (Game) {
  "use strict";

  const BaseWorld = Game.WorldTwo || class {};

  class World extends BaseWorld {
    character = new Game.Character();
    level = Game.level1;

    canvas; ctx; keybord;
    camera_x = 0;

    // UI
    stadusBar = new Game.StatusBar();
    coinBar   = new Game.CoinBar();
    bottleBar = new Game.BottleBar();
    bossBar   = new Game.BossBar();

    // Gameplay
    throwableObject = [];
    coinValue = 0;
    bottleValue = 0;
    bossLife = 100;
    isThrowingBottle = false;

    // Audio
    sound = true;
    coin_sound       = new Audio("assets/audio/coin_sound.mp3");
    bottle_sound     = new Audio("assets/audio/bottle_sound.mp3");
    breakBotte_sound = new Audio("assets/audio/breakBottle.mp3");
    mexico_sound     = new Audio("assets/audio/mexico_sound.mp3");
    squeak_sound     = new Audio("assets/audio/squeak.mp3");
    finalBoss_sound  = new Audio("assets/audio/finalBoss_sound.mp3");

    constructor(canvas, keybord) {
      super();
      this.ctx = canvas.getContext("2d");
      this.canvas = canvas;
      this.keybord = keybord;

      this.character.world = this;
      this.runLoops();
      this.draw();
    }

    // ---------- UTIL ----------
playIfSound(audio) {
  if (this.sound && audio) {
    audio.currentTime = 0;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
      });
    }
  }
}

/**
 * Stomp detection with "band" check + previous-frame foot position.
 * - Must be falling (speedY < 0)
 * - Horizontal overlap (AABB)
 * - Foot crosses the enemy’s top edge between prevBottom and curBottom OR
 *   is still within the enemy’s upper band (robust for low-FPS physics)
 */

    isStompOn(enemy, prevBottom, curBottom) {
      const eTop  = enemy.y + enemy.offset.top;
      const eLeft = enemy.x + enemy.offset.left;
      const eRight= enemy.x + enemy.width - enemy.offset.right;

      const cLeft = this.character.x + this.character.offset.left;
      const cRight= this.character.x + this.character.width - this.character.offset.right;

      const horizontal = cRight > eLeft && cLeft < eRight;
      if (!(this.character.speedY < 0 && horizontal)) return false;

      const tol = 6;

    // 1) actual edge crossing from previous to current frame
    
      const crossedTop = (prevBottom <= eTop + tol) && (curBottom >= eTop - tol);

      // 2) or "in the upper band" (up to the middle + tolerance), if the physics loop ticks less frequently

      const topBandMax = eTop + enemy.height * 0.55 + 14; // 55% + small buffer
      const insideTopBand = curBottom <= topBandMax;

      return crossedTop || insideTopBand;
    }

    // ---------- LOOPS ----------
    runLoops() {
      setInterval(() => {
        this.updateBossTrigger();
        this.checkBossVsCharacter();
        this.updatePickups();
        Game.WorldThrowing.updateThrownBottles(this);
        this.checkThrowObject?.();
        this.isCharacterDead?.();
        if (this.bossLife <= 0) setTimeout(() => this.nextLevel?.(), 2000);
      }, 50);

      // Stomp check with prevBottom tracking (60 FPS)
      setInterval(() => this.updateChickenStomp(), 1000 / 60);
    }

    // ---------- UPDATES ----------
    updateBossTrigger() {
      const boss = this.level.endboss[0];
      if (boss && this.character.x > 1600 && !boss.hadFirstContact) boss.hadFirstContact = true;
    }

    checkBossVsCharacter() {
      const bossHit = this.level.endboss.some(b => b.isColliding(this.character));
      if (!bossHit) return;

      this.character.hit();
      this.character.energy -= 20;
      this.stadusBar.setPercentage(this.character.energy);

      if (this.character.energy <= 0) {
        this.isCharacterDead?.();
        this.playIfSound(this.character?.pains_sound);
        setTimeout(() => (this.sound = false), 1000);
      }
    }

    updatePickups() {
      this.level.coin = this.level.coin.filter(coin => {
        if (!this.character.isColliding(coin)) return true;
        if (this.coinValue < 100) {
          this.coinValue = Math.min(100, this.coinValue + 20);
          this.coinBar.setPercentage(this.coinValue);
          this.playIfSound(this.coin_sound);
        }
        return false;
      });

      this.level.bottle = this.level.bottle.filter(bottle => {
        if (!this.character.isColliding(bottle)) return true;
        if (this.bottleValue < 100) {
          this.bottleValue = Math.min(100, this.bottleValue + 20);
          this.bottleBar.setPercentage(this.bottleValue);
          this.playIfSound(this.bottle_sound);
        }
        return false;
      });
    }

updateChickenStomp() {
  // current/last foot position (bottom of the character hitbox)
  const curBottom  = this.character.y + this.character.height - this.character.offset.bottom;
  const prevBottom = (this.character._prevBottom ?? curBottom);

  // small cooldown to prevent multiple hits in the same frame

  const now = performance.now();
  this._hitCooldownUntil ??= 0;

  // both enemy groups
  [this.level.enemies, this.level.smallChicken].forEach((group) => {
    for (let i = 0; i < group.length; i++) {
      const ch = group[i];
      if (!this.character.isColliding(ch)) continue;

      if (this.isStompOn(ch, prevBottom, curBottom)) {
        // --- STOMP: from above onto the enemy ---
        const enemyTop = ch.y + (ch.offset?.top ?? 0);
        this.character.y = enemyTop - (this.character.height - this.character.offset.bottom) - 1;

        this.playIfSound(this.character.jump_sound);
        this.character.speedY = 30;
        this.character.restartJumpAnim?.();
        this.character.registerAction();

        ch.energy = 0;
        this.playIfSound(this.squeak_sound);

        setTimeout(() => {
          const idx = group.indexOf(ch);
          if (idx > -1) group.splice(idx, 1);
        }, 500);

        this._hitCooldownUntil = now + 80;       // short debounce
        break;                                   // only one enemy per tick
      } else {
        // --- NOT a stomp -> damage the player (sideways/upwards) ---
        if (now >= this._hitCooldownUntil) {
          this.character.hit();
          this.stadusBar.setPercentage(this.character.energy);
          this._hitCooldownUntil = now + 200;    // prevent immediate repeat
        }
        break;
      }
    }
  });

  // store prevBottom for next frame
  this.character._prevBottom = curBottom;
}

/** true if the character crosses the enemy’s top edge while falling (stomp) */
isStompOn(enemy, prevBottom, curBottom) {
  const enemyTop = enemy.y + (enemy.offset?.top ?? 0);
  const falling  = this.character.speedY < 0;        // in your physics < 0 = falling
  const EPS      = 6;                                 // tolerance for flickering

  // Previously below/above? We want: previously above the top, now on/below it.
  return falling
      && prevBottom <= enemyTop + EPS
      && curBottom  >= enemyTop - EPS;
}

    // ---------- RENDER ----------
    draw() {
      Game.WorldRender.draw(this);
      requestAnimationFrame(() => this.draw());
    }

    // ---------- Misc ----------
    iCanThrow() { return Game.WorldThrowing.iCanThrow(this); }
  }

  Game.World = World;
})(window.Game);
