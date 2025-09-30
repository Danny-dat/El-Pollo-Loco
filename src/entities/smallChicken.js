// src/entities/SmallChicken.js
(function (Game) {
  class SmallChicken extends Game.MovableObject {
    constructor() {
      super();

      this.width = 50;
      this.height = 50;
      this.offset = { top: 0, left: 20, right: 20, bottom: 0 };

      this.IMAGES_WALK = [
        'assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
      ];

      this.IMAGES_DEAD = [
        'assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png'
      ];

      this.loadImage(this.IMAGES_WALK[0]);
      this.loadImages(this.IMAGES_WALK);
      this.loadImages(this.IMAGES_DEAD);

      this.y = 390;
      this.x = 300 + Math.random() * 1700;
      this.speed = 1 + Math.random() * 5;

      this.animate();
      this.moveLeft();
    }

    /** Animation/Bewegung */
    animate() {
      setInterval(() => {
        if (this.isDead()) {
          this.playAnimation(this.IMAGES_DEAD);
        } else {
          this.moveLeft();
          this.playAnimation(this.IMAGES_WALK);
        }
      }, 100);
    }
  }

  Game.SmallChicken = SmallChicken;
})(window.Game);
