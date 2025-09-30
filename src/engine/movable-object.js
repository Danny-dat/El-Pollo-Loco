// src/engine/movable-object.js
(function (Game) {
  class MovableObject extends Game.DrawableObject {
    constructor() {
      super();
      this.speed = 0.15;
      this.otherDiretion = false;
      this.speedY = 0;
      this.acceleration = 2.5;
      this.energy = 100;
      this.lastHit = 0;
      this.applygravityInterval = null;
      this.offset = { top: 0, left: 0, right: 0, bottom: 0 };
      this.sound = true;
    }

    applygravity() {
      if (this.applygravityInterval) clearInterval(this.applygravityInterval);
      this.applygravityInterval = setInterval(() => {
        if (this.isAboveGround() || this.speedY > 10) {
          this.y -= this.speedY;
          this.speedY -= this.acceleration;
        }
      }, 1000 / 25);
    }

    isAboveGround() {
      if (this instanceof Game.ThrowableObject) return true;
      return this.y < 90;
    }

    // AABB mit korrekten width/height
    isColliding(mo) {
      return (
        this.x + this.width  - this.offset.right  > mo.x + mo.offset.left &&
        this.y + this.height - this.offset.bottom > mo.y + mo.offset.top  &&
        this.x + this.offset.left                < mo.x + mo.width  - mo.offset.right &&
        this.y + this.offset.top                 < mo.y + mo.height - mo.offset.bottom
      );
    }

    hit() {
      this.energy = Math.max(0, this.energy - 5);
      if (this.energy > 0) this.lastHit = Date.now();
    }

    isHurt() { return (Date.now() - this.lastHit) / 200 < 1; }
    isDead() { return this.energy === 0; }

    playAnimation(images) {
      const i = this.currentImage % images.length;
      this.img = this.imageCache[images[i]];
      this.currentImage++;
    }

    moveRight() { this.x += this.speed; }
    moveLeft()  { this.x -= this.speed; }
  }

  Game.MovableObject = MovableObject;
})(window.Game);
