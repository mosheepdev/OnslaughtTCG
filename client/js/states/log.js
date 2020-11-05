game.states.log = {
  remembername: true,
  build: function () {
    this.box = $('<div>').addClass('box').hide();
    this.parallax = $('<div>').addClass('parallax');
    this.towers = $('<div>').appendTo(this.parallax).addClass('logpara towers');
    this.title = $('<div>').appendTo(this.parallax).addClass('logpara title');
    this.parallax.append(this.box);
    this.front = $('<div>').appendTo(this.parallax).addClass('logpara front');
    this.form = $('<form>').appendTo(this.box).on('submit', function (event) { event.preventDefault(); return false; });
    this.input = $('<input>').appendTo(this.form).attr({placeholder: game.data.ui.choosename/*game.data.ui.logtype*/, type: 'text', required: 'required', minlength: 3, maxlength: 24, tabindex: 1}).keydown(function (event) { if (event.which === 13) { game.states.log.login(); return false; } });
    this.button = $('<button>').addClass('button').appendTo(this.form).text(game.data.ui.log).attr({type: 'submit'}).on('mouseup touchend', this.login);
    this.rememberlabel = $('<label>').addClass('remembername').appendTo(this.form).append($('<span>').text(game.data.ui.remember));
    this.remembercheck = $('<input>').attr({type: 'checkbox', name: 'remember', checked: true}).change(this.remember).appendTo(this.rememberlabel);
    this.out = $('<small>').addClass('logout').hide().insertAfter(game.message).text(game.data.ui.logout).on('mouseup touchend', this.logout);
    var rememberedname = game.getData('name');
    if (rememberedname) { this.input.val(rememberedname); }
    this.el.append(this.parallax);
  },
  start: function () {
    game.states.log.out.hide();
    game.options.opt.show();
    game.loader.removeClass('loading');
    game.triesCounter.text('');
    setTimeout(function(){game.screen.resize();},1000);
    game.states.log.input.attr({value: 'Player'+parseInt(Math.random()*10000)});
    if (!game.states.log.alert) {
      game.states.log.alert = true;
      game.states.log.alertBox();
      if (!game.getData('voted') && game.poll.heroes) game.poll.button.show();
    }
  },
  alertBox: function () {
    var box = $('<div>').addClass('log box');
    game.overlay.el.removeClass('hidden').append(box);
    game.overlay.cb = game.poll.close;
    box.append($('<h1>').text(game.data.ui.warning));
    box.append($('<p>').html(game.data.ui.alphaalert + '<small class="version">' + game.version + '</small>'));
    game.poll.button = $('<div>').hide().addClass('button highlight large').text(game.data.ui.votenexthero).on('mouseup touchend', game.poll.showVotes);
    box.append($('<a>').text('Rating: Eveyone 10+ ESRB').addClass('rating').attr({rel: 'nofollow noopener', href: 'http://www.esrb.org/ratings/ratings_guide.aspx#rating_categories'}));
    box.append(game.poll.button);
    box.append($('<div>').addClass('button').text(game.data.ui.close).on('mouseup touchend', game.poll.close));
  },
  login: function () {
    var valid = game.states.log.input[0].checkValidity(),
        name = game.states.log.input.val();
    if (name && valid) {
      game.player.name = name;
      if (game.states.log.remembername) {
        game.setData('name', name);
      } else {
        game.setData('name', false);
      }
      game.setData('logged', true);
      game.setData('last-activity', new Date().valueOf());
      game.states.log.button.attr('disabled', true);
      game.chat.build(game.data.ui.joined);
      if ('AudioContext' in window) game.audio.build();
      game.states.changeTo('menu');
    } else {
      game.states.log.input.focus();
    }
    return false;
  },
  logout: function () {
    game.overlay.confirm(function (confirmed) {
      if (confirmed) {
        game.audio.stopSong();
        game.setData('logged', false);
        game.clear();
        game.chat.el.hide();
        game.states.changeTo('log');
      }
    });
    return false;
  },
  remember: function () {
    game.states.log.remembername = !game.states.log.remembername;
  },
  end: function () {
    this.button.attr('disabled', false);
  }
};