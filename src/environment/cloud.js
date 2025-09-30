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
     * Einfache Parallax-Bewegung nach links; bei -2000 wieder nach rechts versetzen.
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
