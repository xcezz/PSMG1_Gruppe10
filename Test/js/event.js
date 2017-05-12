var Event = function(){
  var that = {},
  name,
  display,
  id,
  comics,
  characters,

  init = function(data){
    name = data;
    //id = data.id;
    comics = [];
    characters = [];

    return that;
  },

  addComic = function(comic){
    comics.push(comic);
  },

  addCharacter = function(character){
    characters.push(character);
  },

  setDisplay = function(displ){
    display = displ;
  };

  that.init = init;
  that.addComic = addComic;
  that.addCharacter = addCharacter;
  that.setDisplay = setDisplay;
  that.getDisplay = function(){return display;}
  that.getName = function(){return name;}
  that.getComicCount = function(){return comics.length;}
  that.getComics = function(){return comics;}

  return that;
}
