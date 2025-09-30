// src/engine/throwable-object.js
(function (Game) {
  class ThrowableObject extends Game.MovableObject {
    constructor(x, y) {
      super();
      this.isBroken = false;

      this.IMAGES_BOTTEL = [
        'assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
      ];

      this.IMAGES_BOTTEL_SPLASH = [
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
      ];

      this.throwInterval = null;

      this.x = x;
      this.y = y;
      this.height = 50;
      this.width  = 60;

      this.loadImage('assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
      this.loadImages(this.IMAGES_BOTTEL);
      this.loadImages(this.IMAGES_BOTTEL_SPLASH);

      this.throw();
      this.animate();
    }

    /** Throw the bottle */
    throw() {
      this.speedY = 20;
      this.applygravity();

      // Ensure no duplicate interval is running
      if (this.throwInterval) clearInterval(this.throwInterval);

      this.throwInterval = setInterval(() => {
        this.bottleFallsOnTheFloor();
        if (this.isBroken) {
          this.stopBottle();
        } else {
          this.x += 10; // simple trajectory to the right
        }
      }, 25);
    }

    /** Stop bottle / gravity */
    stopBottle() {
      if (this.applygravityInterval) clearInterval(this.applygravityInterval);
      if (this.throwInterval)       clearInterval(this.throwInterval);
    }

    /** Check impact on the ground */
    bottleFallsOnTheFloor() {
      if (this.y >= 350) {
        this.isBroken = true;
      }
    }

    /** Animation (Rotation vs. Splash) */
    animate() {
      setInterval(() => {
        if (this.isBroken && this.isAboveGround()) {
          this.playAnimation(this.IMAGES_BOTTEL_SPLASH);
        } else {
          this.playAnimation(this.IMAGES_BOTTEL);
        }
      }, 50);
    }
  }

  Game.ThrowableObject = ThrowableObject;
})(window.Game);
