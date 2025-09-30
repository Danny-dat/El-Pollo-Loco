window.Game = window.Game || {};
Game.utils = Game.utils || {};
Game.utils.percentageToIndex = function (p) {
  p = Math.max(0, Math.min(100, Number(p) || 0));
  return Math.min(5, Math.ceil(p / 20));
};