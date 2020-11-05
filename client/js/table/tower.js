game.tower = {
  build: function (side, pos) {
    var tower = game.card.build({
      className: 'towers static ' + side,
      side: side,
      name: game.data.ui.tower,
      attribute: game.data.ui.building,
      range: game.data.ui.max,
      description: game.data.ui.towerDescription,
      buffsBox: true,
      armor: 10,
      resistance: 100,
      damage: 18,
      hp: 16
    });
    tower.on('mousedown touchstart', game.card.select);
    tower.place(pos);
    tower.around(tower.data('range'), function (spot) {
      spot.addClass(side + 'area');
    });
    return tower;
  },
  place: function () {
    var p = game.states.config[game.size].tower;
    game.player.tower = game.tower.build('player', p);
    game.enemy.tower = game.tower.build('enemy', game.map.mirrorPosition(p));
  },
  attack: function (side) {
    var from, to,
      attacker = game.opponent(side),
      lowestHp = {
        notfound: true,
        data: function (c) { return Infinity; }
      };
    $('.map .'+ attacker +'area .card.' + side).each(function () {
      var target = $(this);
      if (target.data('current hp') < lowestHp.data('current hp')) {
        lowestHp = target;
      }
    });
    if (!lowestHp.notfound) {
      game[attacker].tower.attack(lowestHp, true);
    }
  }
};
