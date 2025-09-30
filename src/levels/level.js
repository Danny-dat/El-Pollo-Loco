// src/levels/Level.js
(function (Game) {
  /**
   * Represents a level with enemies, environment, and items.
   */
  class Level {
    constructor(enemies, clouds, backgroundObjects, coin, bottle, endboss, smallChicken) {
      /** @type {Game.MovableObject[]} */ this.enemies = enemies;
      /** @type {Game.Cloud[]}          */ this.clouds = clouds;
      /** @type {Game.BackgroundObject[]}*/ this.backgroundObjects = backgroundObjects;
      /** @type {Game.Coin[]}           */ this.coin = coin;
      /** @type {Game.Bottle[]}         */ this.bottle = bottle;
      /** @type {Game.Endboss[]}        */ this.endboss = endboss;
      /** @type {Game.SmallChicken[]}   */ this.smallChicken = smallChicken;

      /** Maximum X position the player can run to (camera/level end) */
      this.level_end_x = 1530;
    }

    /**
     * Removes a coin from the level.
     * @param {Game.Coin} coin
     */
    removeCoin(coin) {
      const i = this.coin.indexOf(coin);
      if (i !== -1) this.coin.splice(i, 1);
    }
  }

  Game.Level = Level;
})(window.Game);
