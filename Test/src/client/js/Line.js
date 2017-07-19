MarvelApp.MarvelModel.Line = function(){
  var that = {};

  function init(co, ch){
    that.comic = co;
    that.character = ch;

    return that;
  }

  that.init = init;

  that.active = false;
  that.comic = undefined;
  that.character = undefined;

  return that;
}
