MarvelApp.MarvelModel.Line = function(){
  var that = {},
  active,
  comic,
  character;

  function init(co, ch){
    active = false;
    comic = co;
    character = ch;

    return that;
  }

  function activate(){
    active = true;
  }

  function deactivate(){
    active = false;
  }

  function getDisplay(){
    var comic_pos = comic.getDisplay();
    var character_pos = character.getDisplay();
    return {
      x_start: comic_pos.x,
      y_start: comic_pos.y,
      x_end: character_pos.x,
      y_end: character_pos.y
    }
  }

  that.init = init;
  that.activate = activate;
  that.deactivate = deactivate;
  that.getDisplay = getDisplay;
  that.isActive = function(){return active;}

  return that;
}
