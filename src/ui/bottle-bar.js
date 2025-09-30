// src/ui/BottleBar.js
(function (Game) {
  class BottleBar extends Game.DrawableObject {
    constructor() {
      super();

      this.IMAGES = [
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png'
      ];

      this.percentage = 0;

      this.x = 30;
      this.y = 80;
      this.width  = 200;
      this.height = 60;

      this.loadImages(this.IMAGES);
      this.setPercentage(0);
    }

    /** Prozent setzen + Bild aktualisieren */
    setPercentage(percentage) {
      this.percentage = Math.max(0, Math.min(100, percentage));
      const path = this.IMAGES[this.resolveImageIndex()];
      this.img = this.imageCache[path];
    }

    /** Index aus Prozent ableiten (0,20,40,60,80,100) */
    resolveImageIndex() {
      if (this.percentage === 0) return 0;
      if (this.percentage <= 20) return 1;
      if (this.percentage <= 40) return 2;
      if (this.percentage <= 60) return 3;
      if (this.percentage <= 80) return 4;
      return 5;
    }
  }

  Game.BottleBar = BottleBar;
})(window.Game);
