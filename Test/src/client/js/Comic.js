MarvelApp.MarvelModel.Comic = function(){
  var that = {},
  name,
  display,
  id,
  characters,
  events,
  lines,
  active;

  function init(data){
    name = data.name;
    id = data.id;
    characters = [];
    events = [];
    lines = [];

    active = false;

    display = {}

    return that;
  }

  function addCharacter(character){
    characters.push(character);
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

  that.init = init;
  that.addCharacter = addCharacter;
  that.addEvent = addEvent;
  that.setDisplay = setDisplay;
  that.addLine = addLine;
  that.activate = activate;
  that.deactivate = deactivate;
  that.isActive = function(){return active;}
  that.getDisplay = function(){return display;}
  that.getName = function(){
    if(name!=undefined){
      return name;
    }else{
      return id;
    }
  }
  that.getId = function(){return id;}
  that.setColor = function(c){display.color = c;}
  that.getCharacters = function(){return characters;}
  that.getEvents = function(){return events;}
  that.getLines = function(){return lines;}

  return that;
}
