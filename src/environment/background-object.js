// src/environment/BackgroundObject.js
(function (Game) {
  /**
   * Teil der Kulisse; wird mit der Kamera verschoben.
   */
  class BackgroundObject extends Game.MovableObject {
    constructor(imagePath, x) {
      super();

      // Größe auf Canvas abgestimmt
      this.width  = 720;
      this.height = 480;

      this.loadImage(imagePath);
      this.x = x;

      // am Boden ausrichten (Canvas-Höhe = 480)
      this.y = 480 - this.height; // -> 0
    }
  }

  Game.BackgroundObject = BackgroundObject;
})(window.Game);
