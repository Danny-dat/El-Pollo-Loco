// src/ui/BossBar.js
(function (Game) {
  class BossBar extends Game.MovableObject {
    constructor() {
      super();

      this.IMAGES = [
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue100.png'
      ];

      this.percentage = 100;

      this.x = 500;
      this.y = 30;
      this.width  = 200;
      this.height = 60;

      this.loadImages(this.IMAGES);
      this.setPercentage(100);
    }

    /**
     * Prozent setzen und passendes Bild wählen.
     * @param {number} percentage
     */
    setPercentage(percentage) {
      this.percentage = Math.max(0, Math.min(100, percentage));
      const path = this.IMAGES[this.resolveImageIndex()];
      this.img = this.imageCache[path];

      // Vertikale Leiste gespiegelt darstellen (wie zuvor genutzt)
      this.otherDirection = true;
      this.otherDiretion  = true; // Alias für Alt-Code
    }

    /** Bildindex anhand des Prozentwerts */
    resolveImageIndex() {
      if (this.percentage >= 100) return 5;
      if (this.percentage >= 80)  return 4;
      if (this.percentage >= 60)  return 3;
      if (this.percentage >= 40)  return 2;
      if (this.percentage >= 20)  return 1;
      return 0;
    }
  }

  Game.BossBar = BossBar;
})(window.Game);
