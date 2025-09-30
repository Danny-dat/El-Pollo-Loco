// src/core/Input.js
(function (Game) {
  class Input {
    constructor() {
      this.LEFT = false;
      this.RIGHT = false;
      this.UP = false;
      this.DOWN = false;
      this.SPACE = false;
      this.D = false;
    }
  }

  Game.Input = Input;
})(window.Game);