// src/ui/StatusBar.js
(function (Game) {
  class StatusBar extends Game.DrawableObject {
    constructor() {
      super();

      this.IMAGES = [
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png'
      ];

      this.percentage = 100;

      this.x = 30;
      this.y = 0;
      this.width  = 200;
      this.height = 60;

      this.loadImages(this.IMAGES);
      this.setPercentage(100);
    }

    /** Prozent setzen + Bild aktualisieren */
    setPercentage(percentage) {
      this.percentage = Math.max(0, Math.min(100, percentage));
      const path = this.IMAGES[this.resolveImageIndex()];
      this.img = this.imageCache[path];
    }

    /** Index anhand des Prozentwerts (0,20,40,60,80,100) */
    resolveImageIndex() {
      if (this.percentage === 100) return 5;
      if (this.percentage > 80)    return 4;
      if (this.percentage > 60)    return 3;
      if (this.percentage > 40)    return 2;
      if (this.percentage > 20)    return 1;
      return 0;
    }
  }

  Game.StatusBar = StatusBar;
})(window.Game);
