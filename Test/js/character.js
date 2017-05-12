var Character = function(){
  var that = {},
  name,
  display,
  id,
  comics,
  events,

  init = function(data){
    name = data;
    //id = data.id;
    comics = [];
    events = [];

    return that;
  },

  addComic = function(comic){
    comics.push(comic);
  },

  addEvent = function(event){
    events.push(event);
  },

  setDisplay = function(displ){
    display = displ;
  };

  that.init = init;
  that.addComic = addComic;
  that.addEvent = addEvent;
  that.setDisplay = setDisplay;
  that.getDisplay = function(){return display;}
  that.getName = function(){return name;}
  that.getComicCount = function(){return comics.length;}
  that.getComics = function(){return comics;}
  that.getEvents = function(){return events;}

  return that;
}
