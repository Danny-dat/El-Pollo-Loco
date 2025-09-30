// src/utils/World.render.js
(function (Game) {
  if (!Game.WorldRender) Game.WorldRender = {};

  /** Haupt-Draw-Funktion: rendert eine World-Instanz auf ihr Canvas */
  Game.WorldRender.draw = function (w) {
    const ctx = w.ctx;
    ctx.clearRect(0, 0, w.canvas.width, w.canvas.height);

    // Welt-Layer (mit Kamera)
    ctx.translate(w.camera_x, 0);
    addObjectsToMap(w, w.level.backgroundObjects);
    addObjectsToMap(w, w.level.clouds);
    addObjectsToMap(w, w.level.bottle);
    ctx.translate(-w.camera_x, 0);

    // UI (screen space)
    addToMap(w, w.stadusBar);
    addToMap(w, w.coinBar);
    addToMap(w, w.bottleBar);
    if (w.level.endboss[0]?.hadFirstContact) addToMap(w, w.bossBar);

    // Spielfiguren & Projektile (mit Kamera)
    ctx.translate(w.camera_x, 0);
    addToMap(w, w.character);
    addObjectsToMap(w, w.level.coin);
    addObjectsToMap(w, w.level.enemies);
    addObjectsToMap(w, w.level.endboss);
    addObjectsToMap(w, w.level.smallChicken);
    addObjectsToMap(w, w.throwableObject);
    ctx.translate(-w.camera_x, 0);
  };

  // ------- helpers (gekapselt in diesem Modul) -------
  function addObjectsToMap(w, list) {
    list.forEach((o) => addToMap(w, o));
  }

  function addToMap(w, mo) {
    if (mo.otherDiretion) flipImage(w, mo);
    mo.draw(w.ctx);

    // optionaler Hitbox-Debug:
    if (window.DEBUG_HITBOX) debugHitbox(w, mo);

    if (mo.otherDiretion) flipImageBack(w, mo);
  }

  function flipImage(w, mo) {
    w.ctx.save();
    w.ctx.translate(mo.width, 0);
    w.ctx.scale(-1, 1);
    mo.x = -mo.x;
  }

  function flipImageBack(w, mo) {
    mo.x = -mo.x;
    w.ctx.restore();
  }

  function debugHitbox(w, mo) {
    const x = mo.x + (mo.offset?.left  || 0);
    const y = mo.y + (mo.offset?.top   || 0);
    const wd = (mo.width  - (mo.offset?.left||0) - (mo.offset?.right ||0));
    const ht = (mo.height - (mo.offset?.top ||0) - (mo.offset?.bottom||0));
    w.ctx.save();
    w.ctx.strokeStyle = 'rgba(0,0,0,0.8)';
    w.ctx.lineWidth = 2;
    w.ctx.strokeRect(x, y, wd, ht);
    w.ctx.restore();
  }
})(window.Game);
