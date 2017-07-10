MarvelApp.MarvelModel.Character = function(){
  var that = {},
  name,
  display,
  id,
  comics,
  events,
  active,
  lines;

  function init(data, color){
    name = data;
    comics = [];
    events = [];
    lines = [];

    active = false;

    display = {
      color: color
    }

    return that;
  }

  function addComic(comic){
    comics.push(comic);
  }

  function addEvent(event){
    events.push(event);
  }

  function addLine(line){
    lines.push(line);
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

  function getDisplay(){
    var d = {};
    for(var element in display){
      d[element] = display[element];
    }
    return d;
  }

  that.init = init;
  that.addComic = addComic;
  that.addEvent = addEvent;
  that.setDisplay = setDisplay;
  that.getDisplay = getDisplay;
  that.addLine = addLine;
  that.activate = activate;
  that.deactivate = deactivate;
  that.isActive = function(){return active;}
  that.getName = function(){return name;}
  that.getComicCount = function(){return comics.length;}
  that.getComics = function(){return comics;}
  that.getEvents = function(){return events;}
  that.getLines = function(){return lines;}

  return that;
}
