// src/engine/drawable-object.js
(function (Game) {
  class DrawableObject {
    constructor() {
      this.img = null;
      this.imageCache = {};
      this.currentImage = 0;
      this.x = -1000;
      this.y = 250;
      // If subclasses set width/height – good.
      // Otherwise, fallback to natural image size when drawing.
      this.width = this.width ?? 0;
      this.height = this.height ?? 0;
    }

    /**
     * Load a single image.
     * @param {string} path
     */
    loadImage(path) {
      const img = new Image();
      img.src = path;
      this.img = img;
      return img;
    }

    /**
     * Draw image (with fallback to natural size if width/height is 0).
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
      if (!this.img || !this.img.complete || !this.img.naturalWidth) return;
      const w = this.width  || this.img.width;
      const h = this.height || this.img.height;
      ctx.drawImage(this.img, this.x, this.y, w, h);
    }

    /**
     * Preload and cache multiple images.
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
