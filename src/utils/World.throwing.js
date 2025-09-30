// src/utils/World.throwing.js
(function (Game) {
  if (!Game.WorldThrowing) Game.WorldThrowing = {};

  /**
   * Darf der Spieler gerade eine Flasche werfen?
   * (Keyboard D, mind. 1 Flasche im Inventar, nicht bereits am Werfen)
   */
  Game.WorldThrowing.iCanThrow = function (w) {
    return !!(w?.keybord?.D) && w.bottleValue > 0 && !w.isThrowingBottle;
  };

  /**
   * Pipeline für Kollisionen der geworfenen Flaschen:
   * 1) Boss  2) SmallChicken  3) Chicken
   */
  Game.WorldThrowing.updateThrownBottles = function (w) {
    if (!w || !w.throwableObject) return;

    w.throwableObject.forEach((bottle) => {
      if (bottle.isBroken) return;

      // Boss
      const boss = w.level.endboss.find(b => b instanceof Game.Endboss && b.isColliding(bottle));
      if (boss) {
        bottle.isBroken = true;
        w.bossLife = Math.max(0, w.bossLife - 20);
        w.bossBar.setPercentage(w.bossLife);
        w.playIfSound?.(w.breakBotte_sound);
        setTimeout(() => Game.WorldThrowing._removeBrokenBottle(w), 300);
        return;
      }

      // Small chickens
      const small = w.level.smallChicken.find(ch => ch.isColliding(bottle));
      if (small) {
        small.energy = 0;
        bottle.isBroken = true;
        w.playIfSound?.(w.breakBotte_sound);
        setTimeout(() => {
          Game.WorldThrowing._removeBrokenBottle(w);
          const idx = w.level.smallChicken.indexOf(small);
          if (idx > -1) w.level.smallChicken.splice(idx, 1);
        }, 800);
        return;
      }

      // Normal chickens
      const enemyIdx = w.level.enemies.findIndex(e => e instanceof Game.Chicken && e.isColliding(bottle));
      if (enemyIdx > -1) {
        w.level.enemies[enemyIdx].energy = 0;
        bottle.isBroken = true;
        w.playIfSound?.(w.breakBotte_sound);
        setTimeout(() => {
          w.level.enemies.splice(enemyIdx, 1);
          Game.WorldThrowing._removeBrokenBottle(w);
        }, 500);
      }
    });
  };

  /** Hilfsfunktion: erste zerbrochene Flasche aus der Liste entfernen */
  Game.WorldThrowing._removeBrokenBottle = function (w) {
    const i = w.throwableObject.findIndex(b => b.isBroken);
    if (i > -1) w.throwableObject.splice(i, 1);
  };

})(window.Game);
