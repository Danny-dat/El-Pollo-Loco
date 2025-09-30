// src/ui/CoinBar.js
(function (Game) {
  class CoinBar extends Game.DrawableObject {
    constructor() {
      super();

      this.IMAGES = [
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png'
      ];

      this.percentage = 0;
      this.coinImageIndex = 0;

      this.x = 30;
      this.y = 40;
      this.width  = 200;
      this.height = 60;

      this.loadImages(this.IMAGES);
      this.setPercentage(0);
    }

    /** Set percentage + update image */
    setPercentage(percentage) {
      this.percentage = Math.max(0, Math.min(100, percentage));
      const path = this.IMAGES[this.resolveImageIndex()];
      this.img = this.imageCache[path];
    }

    /** Derive index from percentage (0,20,40,60,80,100) */
    resolveImageIndex() {
      return Game.utils.percentageToIndex(this.percentage);
    }
  }

  Game.CoinBar = CoinBar;
})(window.Game);
