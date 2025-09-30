// src/environment/BackgroundObject.js
(function (Game) {
  /**
   * Part of the scenery; moves along with the camera.
   */
  class BackgroundObject extends Game.MovableObject {
    constructor(imagePath, x) {
      super();

      // Size adapted to the canvas
      this.width  = 720;
      this.height = 480;

      this.loadImage(imagePath);
      this.x = x;

      // Align with the ground (canvas height = 480)
      this.y = 480 - this.height; // -> 0
    }
  }

  Game.BackgroundObject = BackgroundObject;
})(window.Game);
