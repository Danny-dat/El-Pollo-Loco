// src/entities/Chicken.js
(function (Game) {
  class Chicken extends Game.MovableObject {
    constructor() {
      super();

      this.y = 360;
      this.width = 80;
      this.height = 80;
      this.offset = { top: 0, left: 20, right: 20, bottom: 0 };

      this.IMAGES_WALKING = [
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
      ];

      this.IMAGES_DEAD = [
        'assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
      ];

      this.loadImage(this.IMAGES_WALKING[0]);
      this.loadImages(this.IMAGES_WALKING);
      this.loadImages(this.IMAGES_DEAD);

      this.x = 300 + Math.random() * 1200;
      this.speed = 1 + Math.random() * 5;

      this.animate();
    }

    /** Bewegung + Animation */
    animate() {
      setInterval(() => {
        if (this.isDead()) {
          this.playAnimation(this.IMAGES_DEAD);
          return;
        }
        this.moveLeft();
        this.playAnimation(this.IMAGES_WALKING);
      }, 100);
    }
  }

  Game.Chicken = Chicken;
})(window.Game);
