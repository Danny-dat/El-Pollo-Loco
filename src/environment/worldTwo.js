// src/environment/worldTwo.js
(function (Game) {
  class WorldTwo {
    /** Flag, damit Game-Over nicht mehrfach getriggert wird */
    gameOverDisplayed = false;

    constructor() {
      this.play();
    }

    /** prüft periodisch den Game-Over-Zustand */
    play() {
      setInterval(() => this.gameOver(), 1000);
    }

    /** Game-Over-Overlay ein-/ausblenden */
    gameOver() {
      // Sowohl ID als auch Klasse akzeptieren
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

    /** Character tot? Dann Game Over einmalig anzeigen */
    isCharacterDead() {
      if (!this.character) return; // falls noch nicht gesetzt
      if (!this.gameOverDisplayed && this.character.energy <= 0) {
        this.gameOverDisplayed = true;
        this.gameOver();
        this.character?.sleep_sound?.pause();
      }
    }

    /** Next-Level-Screen zeigen */
    nextLevel() {
      const el = document.getElementById("nextLevel");
      if (el) el.style.display = "flex";
    }

    /** Münzsound abspielen (sofern aktiv) */
    playCoinSound() {
      if (this.sound === true) this.coin_sound?.play();
    }

    /** Kollisionen mit Coins prüfen + UI updaten */
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

    /** Kollisionen mit sammelbaren Flaschen prüfen + UI updaten */
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
     * Flasche werfen: Objekt erzeugen, Inventar reduzieren, Flag setzen.
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

    /** Geworfene Flasche nach kurzer Zeit entfernen */
    removeThrowableObject(index) {
      setTimeout(() => {
        if (typeof index === "number") {
          this.throwableObject.splice(index, 1);
        } else {
          // falls kein Index übergeben: erste zerbrochene/erste entfernen
          const i = this.throwableObject.findIndex((b) => b.isBroken);
          if (i > -1) this.throwableObject.splice(i, 1);
          else this.throwableObject.shift?.();
        }
        this.isThrowingBottle = false;
        if (this.sound === true) this.breakBotte_sound?.play();
      }, 1250);
    }

    /** Wurf auslösen, ggf. Boss direkt treffen, Bottle wieder entfernen */
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
