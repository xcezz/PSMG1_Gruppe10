var Comic = function(){
  var that = {},
  name,
  display,
  id,
  characters,
  events,

  init = function(data){
    name = data.name;
    id = data.id;
    characters = [];
    events = [];

    return that;
  },

  addCharacter = function(character){
    characters.push(character);
  },

  addEvent = function(event){
    events.push(event);
  },

  setDisplay = function(displ){
    display = displ;
  };

  that.init = init;
  that.addCharacter = addCharacter;
  that.addEvent = addEvent;
  that.setDisplay = setDisplay;
  that.getDisplay = function(){return display;}
  that.getName = function(){
    if(name!=undefined){
      return name;
    }else{
      return id;
    }
  }
  that.getId = function(){return id;}

  return that;
}
