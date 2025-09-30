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
      if (this.sound && audio) { audio.currentTime = 0; audio.play(); }
    }

    /**
     * Stomp-Erkennung mit „Band“-Check + Vor-Frame-Fußposition.
     * - Muss fallen (speedY < 0)
     * - horizontale Überlappung (AABB)
     * - Fuß kreuzt zwischen prevBottom und curBottom die Gegner-Oberkante ODER
     *   befindet sich noch im oberen Band des Gegners (robust bei Low-FPS-Physik)
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

      // 1) echte Kanten-Kreuzung vom Vor- zum aktuellen Frame
      const crossedTop = (prevBottom <= eTop + tol) && (curBottom >= eTop - tol);

      // 2) oder „im oberen Band“ (bis zur Mitte + Toleranz), falls Physik-Loop seltener tickt
      const topBandMax = eTop + enemy.height * 0.55 + 14; // 55% + kleine Reserve
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

      // Stomp-Check mit prevBottom-Tracking (60 FPS)
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
  // aktuelle/letzte Fußposition (Bottom der Char-Hitbox)
  const curBottom  = this.character.y + this.character.height - this.character.offset.bottom;
  const prevBottom = (this.character._prevBottom ?? curBottom);

  // kleiner Cooldown, um mehrfach-Treffer im selben Frame zu vermeiden
  const now = performance.now();
  this._hitCooldownUntil ??= 0;

  // beide Gruppen prüfen
  [this.level.enemies, this.level.smallChicken].forEach((group) => {
    for (let i = 0; i < group.length; i++) {
      const ch = group[i];
      if (!this.character.isColliding(ch)) continue;

      if (this.isStompOn(ch, prevBottom, curBottom)) {
        // --- STOMP: von oben getroffen ---
        // Char kurz über dem Gegner „einrasten“, dann hochfedern
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

        this._hitCooldownUntil = now + 80;       // kurzer Entprellschutz
        break;                                   // nur ein Gegner pro Tick
      } else {
        // --- KEIN Stomp -> Schaden für den Spieler (seitlich/aufwärts) ---
        if (now >= this._hitCooldownUntil) {
          this.character.hit();
          this.stadusBar.setPercentage(this.character.energy);
          this._hitCooldownUntil = now + 200;    // nicht sofort wieder
        }
        break;
      }
    }
  });

  // prevBottom für das nächste Frame speichern
  this.character._prevBottom = curBottom;
}

/** true, wenn der Char beim Fallen die Gegner-Oberkante kreuzt (Stomp) */
isStompOn(enemy, prevBottom, curBottom) {
  const enemyTop = enemy.y + (enemy.offset?.top ?? 0);
  const falling  = this.character.speedY < 0;        // in deiner Physik < 0 = fällt
  const EPS      = 6;                                 // Toleranz gegen Flimmern

  // Vorher unter/oberhalb? Wir wollen: vorher über der Oberkante, jetzt auf/unter ihr.
  return falling
      && prevBottom <= enemyTop + EPS
      && curBottom  >= enemyTop - EPS;
}

    // ---------- RENDER ----------
    draw() {
      Game.WorldRender.draw(this);
      requestAnimationFrame(() => this.draw());
    }

    // ---------- Kleinzeug ----------
    iCanThrow() { return Game.WorldThrowing.iCanThrow(this); }
  }

  Game.World = World;
})(window.Game);
