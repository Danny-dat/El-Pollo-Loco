// src/engine/drawable-object.js
(function (Game) {
  class DrawableObject {
    constructor() {
      this.img = null;
      this.imageCache = {};
      this.currentImage = 0;
      this.x = -1000;
      this.y = 250;
      // Falls Subklassen width/height setzen – gut.
      // Sonst fallbacken wir beim Zeichnen auf natürliche Bildgröße.
      this.width = this.width ?? 0;
      this.height = this.height ?? 0;
    }

    /**
     * Ein einzelnes Bild laden.
     * @param {string} path
     */
    loadImage(path) {
      const img = new Image();
      img.src = path;
      this.img = img;
      return img;
    }

    /**
     * Bild zeichnen (mit Fallback auf natürliche Größe, falls width/height 0).
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
      if (!this.img || !this.img.complete || !this.img.naturalWidth) return;
      const w = this.width  || this.img.width;
      const h = this.height || this.img.height;
      ctx.drawImage(this.img, this.x, this.y, w, h);
    }

    /**
     * Mehrere Bilder vorladen und cachen.
     * @param {string[]} arr
     */
    loadImages(arr) {
      arr.forEach((path) => {
        const img = new Image();
        img.src = path;
        this.imageCache[path] = img;
      });
    }
  }

  Game.DrawableObject = DrawableObject;
})(window.Game);
