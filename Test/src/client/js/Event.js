MarvelApp.MarvelModel.Event = function(){
  var that = {},
  name,
  display,
  id,
  comics,
  active,
  characters;

  function init(data, color){
    name = data;
    comics = [];
    characters = [];

    active = false;

    display = {
      color: color
    }

    return that;
  }

  function addComic(comic){
    comics.push(comic);
  }

  function addCharacter(character){
    characters.push(character);
  }

  function setDisplay(displ){
    for(var element in displ){
      display[element] = displ[element];
    }
  }

  function activate(){
    active = true;
  }

  function deactivate(){
    active = false;
  }

  that.init = init;
  that.addComic = addComic;
  that.addCharacter = addCharacter;
  that.setDisplay = setDisplay;
  that.activate = activate;
  that.deactivate = deactivate;
  that.isActive = function(){return active;}
  that.getDisplay = function(){return display;}
  that.getName = function(){return name;}
  that.getComicCount = function(){return comics.length;}
  that.getComics = function(){return comics;}
  that.getCharacters = function(){return characters;}

  return that;
}
