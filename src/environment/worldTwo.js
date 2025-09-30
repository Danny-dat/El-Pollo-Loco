// src/environment/worldTwo.js
(function (Game) {
  class WorldTwo {
    /** Flag to prevent Game-Over from triggering multiple times */
    gameOverDisplayed = false;

    constructor() {
      this.play();
    }

    /** Periodically checks the Game-Over state */
    play() {
      setInterval(() => this.gameOver(), 1000);
    }

    /** Show/hide the Game-Over overlay */
    gameOver() {
      // Accept both ID and class
      const el =
        document.getElementById("gameOver") ||
        document.querySelector(".gameOver");
      if (!el || !this.character) return;

      if (this.character.energy <= 0) {
        el.style.display = "block";
      } else {
        el.style.display = "none";
        this.gameOverDisplayed = false;
      }
    }

    /** If the character is dead, display Game Over once */
    isCharacterDead() {
      if (!this.character) return; // in case not yet set
      if (!this.gameOverDisplayed && this.character.energy <= 0) {
        this.gameOverDisplayed = true;
        this.gameOver();
        this.character?.sleep_sound?.pause();
      }
    }

    /** Show the Next-Level screen */
    nextLevel() {
      const el = document.getElementById("nextLevel");
      if (el) el.style.display = "flex";
    }

    /** Play coin sound (if enabled) */
    playCoinSound() {
      if (this.sound === true) this.coin_sound?.play();
    }

    /** Check collisions with coins + update UI */
    coinStatus() {
      if (!this.level || this.coinValue > 100) return;

      this.level.coin.forEach((coin) => {
        if (this.isCharacterCollidingCoin(coin)) {
          this.characterIsCollidingCoin(coin);
          if (this.coinValue > 100) this.coinValue = 100;
          this.coinBar?.setPercentage(this.coinValue);
        }
      });
    }

    /** Check collisions with collectible bottles + update UI */
    bottleValueStatus() {
      if (!this.level || this.bottleValue >= 100) return;

      this.level.bottle.forEach((bottle, index) => {
        if (this.checkCharachrterForCollidingBottle(bottle)) {
          this.characterIsCollidingBottle(bottle);
          if (this.bottleValue > 100) this.bottleValue = 100;
          this.bottleBar?.setPercentage(this.bottleValue);
          this.level.bottle.splice(index, 1);
          this.bossBar?.setPercentage?.(this.bossLife);
        }
      });
    }

    /**
     * Throw a bottle: create object, reduce inventory, set flag.
     * @returns {Game.ThrowableObject}
     */
    bottleStatus() {
      const x = (this.character?.x ?? 0) + 100;
      const y = (this.character?.y ?? 0) + 100;

      const bottle = new Game.ThrowableObject(x, y);
      this.throwableObject.push(bottle);

      this.bottleValue -= 20;
      this.bottleBar?.setPercentage(this.bottleValue);

      this.isThrowingBottle = true;
      return bottle;
    }

    /** Remove thrown bottle after a short delay */
    removeThrowableObject(index) {
      setTimeout(() => {
        if (typeof index === "number") {
          this.throwableObject.splice(index, 1);
        } else {
          // if no index provided: remove first broken/first in list
          const i = this.throwableObject.findIndex((b) => b.isBroken);
          if (i > -1) this.throwableObject.splice(i, 1);
          else this.throwableObject.shift?.();
        }
        this.isThrowingBottle = false;
        if (this.sound === true) this.breakBotte_sound?.play();
      }, 1250);
    }

    /** Trigger throw, possibly hit boss directly, remove bottle */
    checkThrowObject() {
      if (this.iCanThrow && this.iCanThrow()) {
        const bottle = this.bottleStatus();
        if (
          this.checkForCollidingBottleOfBoss &&
          this.checkForCollidingBottleOfBoss(bottle)
        ) {
          this.bossLifeToUpdate?.(this.bossBar);
        }
        this.removeThrowableObject();
      }
    }
  }

  Game.WorldTwo = WorldTwo;
})(window.Game);
