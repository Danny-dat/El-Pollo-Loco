// src/entities/Character.js
(function (Game) {
  class Character extends Game.MovableObject {
    constructor() {
      super();

      // --- Dimensions/Physics ---
      this.width = 150;
      this.height = 350;
      this.y = 90;
      this.speed = 5;
      this.offset = { top: 100, left: 30, right: 25, bottom: 20 };

      // --- Sprites ---
      this.IMAGES_WALKING = [
        'assets/img/2_character_pepe/2_walk/W-21.png',
        'assets/img/2_character_pepe/2_walk/W-22.png',
        'assets/img/2_character_pepe/2_walk/W-23.png',
        'assets/img/2_character_pepe/2_walk/W-24.png',
        'assets/img/2_character_pepe/2_walk/W-25.png',
        'assets/img/2_character_pepe/2_walk/W-26.png'
      ];
      this.IMAGES_JUMPING = [
        'assets/img/2_character_pepe/3_jump/J-31.png',
        'assets/img/2_character_pepe/3_jump/J-32.png',
        'assets/img/2_character_pepe/3_jump/J-33.png',
        'assets/img/2_character_pepe/3_jump/J-34.png',
        'assets/img/2_character_pepe/3_jump/J-35.png',
        'assets/img/2_character_pepe/3_jump/J-36.png',
        'assets/img/2_character_pepe/3_jump/J-37.png',
        'assets/img/2_character_pepe/3_jump/J-38.png',
        'assets/img/2_character_pepe/3_jump/J-39.png'
      ];
      this.IMAGES_DEAD = [
        'assets/img/2_character_pepe/5_dead/D-51.png',
        'assets/img/2_character_pepe/5_dead/D-52.png',
        'assets/img/2_character_pepe/5_dead/D-53.png',
        'assets/img/2_character_pepe/5_dead/D-54.png',
        'assets/img/2_character_pepe/5_dead/D-55.png',
        'assets/img/2_character_pepe/5_dead/D-56.png',
        'assets/img/2_character_pepe/5_dead/D-57.png'
      ];
      this.IMAGES_HURT = [
        'assets/img/2_character_pepe/4_hurt/H-41.png',
        'assets/img/2_character_pepe/4_hurt/H-42.png',
        'assets/img/2_character_pepe/4_hurt/H-43.png'
      ];
      this.IMAGES_STAND = [
        'assets/img/2_character_pepe/1_idle/idle/I-1.png',
        'assets/img/2_character_pepe/1_idle/idle/I-2.png',
        'assets/img/2_character_pepe/1_idle/idle/I-3.png',
        'assets/img/2_character_pepe/1_idle/idle/I-4.png',
        'assets/img/2_character_pepe/1_idle/idle/I-5.png',
        'assets/img/2_character_pepe/1_idle/idle/I-6.png',
        'assets/img/2_character_pepe/1_idle/idle/I-7.png',
        'assets/img/2_character_pepe/1_idle/idle/I-8.png',
        'assets/img/2_character_pepe/1_idle/idle/I-9.png',
        'assets/img/2_character_pepe/1_idle/idle/I-10.png'
      ];
      this.IMAGES_LONGSTAND = [
        'assets/img/2_character_pepe/1_idle/long_idle/I-11.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-12.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-13.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-14.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-15.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-16.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-17.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-18.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-19.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-20.png'
      ];

      // --- Audio ---
      this.walking_sound = new Audio('assets/audio/walking_sound.mp3');
      this.jump_sound    = new Audio('assets/audio/jump_sound.mp3');
      this.pains_sound   = new Audio('assets/audio/game-over-sound.mp3');
      this.sleep_sound   = new Audio('assets/audio/sleep.mp3');
      this.hurt_sound    = new Audio('assets/audio/aua.mp3');

      // Walking sound: loop + moderate playback speed
      this.walking_sound.loop = true;
      this.walking_sound.playbackRate = 1;
      this.walking_sound.volume = 0.6;

      // --- Idle/Action Timer ---
      this.idleDelayMs   = 5000;           // 5s until Long-Idle/Sleep
      this.lastActionAt  = Date.now();     // updated on every action

      // Jump animation restart flag (for Stomp)
      this._forceJumpRestart = false;

      // --- Load assets ---
      this.loadImage(this.IMAGES_WALKING[0]);
      [ this.IMAGES_WALKING,
        this.IMAGES_JUMPING,
        this.IMAGES_DEAD,
        this.IMAGES_HURT,
        this.IMAGES_STAND,
        this.IMAGES_LONGSTAND
      ].forEach(arr => this.loadImages(arr));

      // --- Start ---
      this.applygravity();
      this.animate();
    }

    // ===== Idle/Action Helpers =====
    registerAction() { this.lastActionAt = Date.now(); }
    isIdleTimedOut() { return Date.now() - this.lastActionAt >= this.idleDelayMs; }

    // ===== API: Restart jump animation deliberately (e.g., on Stomp) =====
    restartJumpAnim() { this._forceJumpRestart = true; }

    // ===== Loops =====
    animate() {
      // 60 FPS: control input/movement/camera & step sound
      setInterval(() => {
        this.updateWalkSound();
        this.handleMovement();
        this.blockThrowLeft();
        if (this.world) this.world.camera_x = -this.x + 100;
      }, 1000 / 60);

      // 10 FPS: switch animation frames
      setInterval(() => this.updateAnimation(), 100);
    }

    // ===== Helpers =====
    get isMoving() {
      return !!(this.world?.keybord?.RIGHT || this.world?.keybord?.LEFT);
    }

playOnce(audio) {
  if (!this.world?.sound) return;
  audio.currentTime = 0;
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.catch(error => {
    });
  }
}

    // ===== Sound control (slow walking loop) =====
    updateWalkSound() {
      if (!this.world?.sound) {
        this.walking_sound.pause();
        return;
      }
if (this.isMoving && !this.isAboveGround()) {
  if (this.walking_sound.paused) {
    const playPromise = this.walking_sound.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {}); // silently ignore errors
    }
  }
} else {
        this.walking_sound.pause();
      }
    }

    // ===== Animation automaton =====
    updateAnimation() {
      if (this.isDead()) {
        this.playDeadAnimation();
        return;
      }
      if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
        this.playOnce(this.hurt_sound);
        return;
      }

      // In the air -> always jump frames, never idle/sleep
      if (this.isAboveGround()) {
        if (this._forceJumpRestart) {
          this.currentImage = 0;
          this._forceJumpRestart = false;
        }
        this.playAnimation(this.IMAGES_JUMPING);
        return;
      }

      // On the ground:
      if (this.isMoving) {
        this.registerAction();
        this.playAnimation(this.IMAGES_WALKING);
        this.sleep_sound.pause();
        return;
      }

      // Standing still on the ground -> Idle/Long-Idle after timeout
if (this.isIdleTimedOut()) {
  this.playAnimation(this.IMAGES_LONGSTAND);
  if (this.world?.sound && this.sleep_sound.paused) {
      const playPromise = this.sleep_sound.play();
      if (playPromise !== undefined) {
          playPromise.catch(error => {}); // silently ignore errors
      }
  }
}
    }

    playDeadAnimation() {
      this.playAnimation(this.IMAGES_DEAD);
      if (this.world?.sound) {
        this.playOnce(this.pains_sound);
        this.world.sound = false;
      }
    }

    // ===== Movement / Inputs =====
    handleMovement() {
      if (this.canMoveRight()) { this.moveRight(); this.registerAction(); }
      if (this.canMoveLeft())  { this.moveLeft();  this.registerAction(); }
      if (this.canJump())      { this.triggerJump(); }
    }

    triggerJump() {
      this.playOnce(this.jump_sound);
      this.currentImage = 0;     // start jump frames “fresh”
      this.jump();
      this.registerAction();
      this.sleep_sound.pause();
    }

    moveRight() {
      if (this.world?.sound && this.walking_sound.paused && !this.isAboveGround()) {
        this.walking_sound.play();
      }
      super.moveRight();
      this.otherDiretion = false; // (compatibility)
    }

    moveLeft() {
      if (this.world?.sound && this.walking_sound.paused && !this.isAboveGround()) {
        this.walking_sound.play();
      }
      super.moveLeft();
      this.otherDiretion = true; // (compatibility)
    }

    // ===== Permissions =====
    canJump()       { return !!this.world?.keybord?.SPACE && !this.isAboveGround(); }
    canMoveRight()  { const endX = this.world?.level?.level_end_x ?? Infinity; return !!this.world?.keybord?.RIGHT && this.x < endX; }
    canMoveLeft()   { return !!this.world?.keybord?.LEFT && this.x > -1330; }

    // ===== Actions =====
    jump() { this.speedY = 30; }

    blockThrowLeft() {
      if (this.otherDiretion === true && this.world?.keybord) {
        this.world.keybord.D = false;
      }
    }
  }

  Game.Character = Character;
})(window.Game);
