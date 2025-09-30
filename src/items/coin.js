// src/items/Coin.js
(function (Game) {
  class Coin extends Game.MovableObject {
    constructor() {
      super();

      this.IMAGES_COIN = [
        'assets/img/8_coin/coin_1.png',
        'assets/img/8_coin/coin_2.png'
      ];

      this.offset = { top: 60, left: 35, right: 35, bottom: 60 };

      this.loadImage(this.IMAGES_COIN[0]);
      this.loadImages(this.IMAGES_COIN);

      // Position & size
      this.x = Math.random() * -1400 + Math.random() * 1800;
      this.y = 100 + Math.random() * 200;
      this.height = 100;
      this.width  = 100;

      this.animate();
    }

    /** Simple collection animation */
    animate() {
      setInterval(() => {
        this.playAnimation(this.IMAGES_COIN);
      }, 500);
    }
  }

  Game.Coin = Coin;
})(window.Game);
