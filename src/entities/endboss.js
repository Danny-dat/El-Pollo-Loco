(function (Game) {
  class Endboss extends Game.MovableObject {
    constructor() {
      super();

      this.height = 400;
      this.width  = 400;
      this.y = 50;

      this.firstContact   = false;
      this.hadFirstContact = false;

      this.offset = { top: 20, left: 80, right: 80, bottom: 0 };

      this.IMAGES_ALERT = [
        'assets/img/4_enemie_boss_chicken/2_alert/G5.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G6.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G7.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G8.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G9.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G10.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G11.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G12.png'
      ];

      this.IMAGES_DEAD = [
        'assets/img/4_enemie_boss_chicken/5_dead/G24.png',
        'assets/img/4_enemie_boss_chicken/5_dead/G25.png',
        'assets/img/4_enemie_boss_chicken/5_dead/G26.png'
      ];

      this.IMAGES_HURT = [
        'assets/img/4_enemie_boss_chicken/4_hurt/G21.png',
        'assets/img/4_enemie_boss_chicken/4_hurt/G22.png',
        'assets/img/4_enemie_boss_chicken/4_hurt/G23.png'
      ];

      this.IMAGES_ATTACK = [
        'assets/img/4_enemie_boss_chicken/3_attack/G13.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G14.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G15.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G16.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G17.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G18.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G19.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G20.png'
      ];

      this.chickenBoss_sound = new Audio('assets/audio/chickenBoss.mp3');

      this.loadImage(this.IMAGES_ALERT[0]);
      this.loadImages(this.IMAGES_ALERT);
      this.loadImages(this.IMAGES_DEAD);
      this.loadImages(this.IMAGES_HURT);
      this.loadImages(this.IMAGES_ATTACK);

      this.x = 2100;
      this.speed = 3;

      this.animate();
    }

    /** Bequemer Zugriff auf die aktuelle World-Instanz */
    get W() {
      return this.world || window.world || Game.world;
    }

    /**
     * Startet Bewegung/Logik (60 FPS) und Animations-/Soundloop (200 ms)
     */
    animate() {
      // Bewegung/Verfolgung
      setInterval(() => {
        if (this.hadFirstContact) {
          this.bossRanUntiltheEnd();
        }
      }, 1000 / 60);

      // Animation + Sounds
      setInterval(() => {
        this.checkMexicoSound();
        this.checkFinalBossSound();
        this.bossAnimation();
      }, 200);
    }

    /** Prüft, ob eine der geworfenen Flaschen den Boss trifft */
    bossGetsHit() {
      const w = this.W;
      if (!w) return false;
      let isHurt = false;
      w.throwableObject.forEach((bottle) => {
        if (this.isColliding(bottle)) isHurt = true;
      });
      return isHurt;
    }

    /** Charakter tot? */
    energIsAtZero() {
      const w = this.W;
      return !!w && w.character.energy <= 0;
    }

    /** Mexico-Sound steuern */
    checkMexicoSound() {
      const w = this.W;
      if (!w) return;
      if (w.sound === false) {
        w.mexico_sound.pause();
      } else {
        // beim Aufruf immer kurz resetten verhindert "kein Ton beim ersten Mal" in manchen Browsern
        if (w.mexico_sound.paused) {
          w.mexico_sound.currentTime = 0;
          w.mexico_sound.play();
        }
      }
    }

    /** Final-Boss Sound abhängig von Status */
    checkFinalBossSound() {
      this.bossIsDead();
      this.characterSeesBoss();
    }

    /** Wählt passende Animationsframes */
    bossAnimation() {
      const w = this.W;
      if (!w) return;

      if (w.bossLife >= 80) {
        this.playAnimation(this.IMAGES_ATTACK);
      } else if (this.bossGetsHit()) {
        this.playAnimation(this.IMAGES_HURT);
        this.chickenBossSound();
      } else if (w.bossLife <= 0) {
        this.playAnimation(this.IMAGES_DEAD);
        w.finalBoss_sound.pause();
      } else {
        this.playAnimation(this.IMAGES_ATTACK);
      }
    }

    /** Boss-Schmerzenssound */
    chickenBossSound() {
      const w = this.W;
      if (w && w.sound === true) {
        this.chickenBoss_sound.currentTime = 0;
        this.chickenBoss_sound.play();
      }
    }

    /** Wenn Char tot: Sounds stoppen */
    bossIsDead() {
      const w = this.W;
      if (!w) return;
      if (this.energIsAtZero()) {
        w.finalBoss_sound.pause();
        w.mexico_sound.pause();
      }
    }

    /** Sichtkontakt Boss ↔ Charakter, Sounds/State umschalten */
    characterSeesBoss() {
      const w = this.W;
      if (!w) return;

      if (w.character.x >= 1160 || this.hadFirstContact) {
        this.hadFirstContact = true;
        w.mexico_sound.pause();

        if (w.sound === true) {
          w.finalBoss_sound.volume = 0.8;
          if (w.finalBoss_sound.paused) {
            w.finalBoss_sound.currentTime = 0;
            w.finalBoss_sound.play();
          }
        } else {
          w.finalBoss_sound.pause();
        }

        this.bossRanUntiltheEnd();
      }
    }

    /** Boss bewegt sich auf den Charakter zu, bis besiegt */
    bossRanUntiltheEnd() {
      const w = this.W;
      if (!w) return;

      if (w.bossLife > 0) {
        if (w.character.x > this.x) this.moveRight();
        else this.moveLeft();
      } else {
        w.sound = false;
      }
    }
  }

  Game.Endboss = Endboss;
})(window.Game);
