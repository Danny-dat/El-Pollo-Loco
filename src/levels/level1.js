// src/levels/level1.js
(function (Game) {
  function initLevel() {
    Game.level1 = new Game.Level(
      // enemies
      [
        new Game.Chicken(),
        new Game.Chicken(),
        new Game.Chicken(),
        new Game.Chicken(),
        new Game.Chicken(),
        new Game.Chicken()
      ],
      // clouds
      [
        new Game.Cloud(), new Game.Cloud(), new Game.Cloud(), new Game.Cloud(),
        new Game.Cloud(), new Game.Cloud(), new Game.Cloud(), new Game.Cloud()
      ],
      // backgroundObjects (parallax layers)
      [
        new Game.BackgroundObject('assets/img/5_background/layers/air.png', -719 * 2),
        new Game.BackgroundObject('assets/img/5_background/layers/3_third_layer/1.png', -719 * 2),
        new Game.BackgroundObject('assets/img/5_background/layers/2_second_layer/1.png', -719 * 2),
        new Game.BackgroundObject('assets/img/5_background/layers/1_first_layer/1.png', -719 * 2),

        new Game.BackgroundObject('assets/img/5_background/layers/air.png', -719),
        new Game.BackgroundObject('assets/img/5_background/layers/3_third_layer/2.png', -719),
        new Game.BackgroundObject('assets/img/5_background/layers/2_second_layer/2.png', -719),
        new Game.BackgroundObject('assets/img/5_background/layers/1_first_layer/2.png', -719),

        new Game.BackgroundObject('assets/img/5_background/layers/air.png', 0),
        new Game.BackgroundObject('assets/img/5_background/layers/3_third_layer/1.png', 0),
        new Game.BackgroundObject('assets/img/5_background/layers/2_second_layer/1.png', 0),
        new Game.BackgroundObject('assets/img/5_background/layers/1_first_layer/1.png', 0),

        new Game.BackgroundObject('assets/img/5_background/layers/air.png', 719),
        new Game.BackgroundObject('assets/img/5_background/layers/3_third_layer/2.png', 719),
        new Game.BackgroundObject('assets/img/5_background/layers/2_second_layer/2.png', 719),
        new Game.BackgroundObject('assets/img/5_background/layers/1_first_layer/2.png', 719),

        new Game.BackgroundObject('assets/img/5_background/layers/air.png', 719 * 2),
        new Game.BackgroundObject('assets/img/5_background/layers/3_third_layer/1.png', 719 * 2),
        new Game.BackgroundObject('assets/img/5_background/layers/2_second_layer/1.png', 719 * 2),
        new Game.BackgroundObject('assets/img/5_background/layers/1_first_layer/1.png', 719 * 2)
      ],
      // coins
      [ new Game.Coin(), new Game.Coin(), new Game.Coin(), new Game.Coin(), new Game.Coin() ],
      // bottles on ground
      [
        new Game.Bottle('assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png'),
        new Game.Bottle('assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png'),
        new Game.Bottle('assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png'),
        new Game.Bottle('assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png'),
        new Game.Bottle('assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png'),
        new Game.Bottle('assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png'),
        new Game.Bottle('assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png'),
        new Game.Bottle('assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png'),
        new Game.Bottle('assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png'),
        new Game.Bottle('assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png'),
        new Game.Bottle('assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png')
      ],
      // endboss
      [ new Game.Endboss() ],
      // small chickens
      [ new Game.SmallChicken(), new Game.SmallChicken(), new Game.SmallChicken(), new Game.SmallChicken() ],
    );
  }

  Game.initLevel = initLevel;
  // compatibility with legacy code:
  window.initLevel = initLevel;
})(window.Game);
