// src/environment/Cloud.js
(function (Game) {
  class Cloud extends Game.MovableObject {
    constructor() {
      super();

      this.y = 20;
      this.width  = 500;
      this.height = 250;

      this.loadImage('assets/img/5_background/layers/4_clouds/1.png');

      this.x = Math.random() * 5000;
      this.speed = Math.random() * 0.5;

      this.animate();
    }

    /**
     * Simple parallax movement to the left; reset to the right when reaching -2000.
     */
    animate() {
      setInterval(() => {
        this.moveLeft();
        if (this.x <= -2000) {
          this.x += 4000;
        }
      }, 1000 / 60);
    }
  }

  Game.Cloud = Cloud;
})(window.Game);
