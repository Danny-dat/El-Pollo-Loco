// src/items/Bottle.js
(function (Game) {
  class Bottle extends Game.MovableObject {
    constructor(imagePath) {
      super();

      this.width = 80;
      this.height = 80;
      this.y = 100;
      this.offset = { top: 0, left: 50, right: 50, bottom: 0 };

      this.loadImage(imagePath);
      // zufällige X-Position innerhalb Levelbreite (an deinen Code angelehnt)
      this.x = Math.random() * (719 * 2 + 1400) - 1250;
      this.y = 356;
    }
  }

  Game.Bottle = Bottle;
})(window.Game);
