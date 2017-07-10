MarvelApp.MarvelModel = function(){
  "use strict"

  const noEvent = "No Event";

  var that = {},
  onDataUpdated,
  comicCountEvents,
  
  lines,
  comics,
  characters,
  events,

  eventToIndex,
  characterToIndex,
  comicToIndex,

  colorData,
  sizeData,

  layout;

  function init(layoutSizeData,colors,elementSizeData){
    resetModelVariables();
    colorData = colors;
    sizeData = elementSizeData;
    layout = new MarvelApp.MarvelModel.MyLayout(layoutSizeData);
  }

  function resetModelVariables(){
    comicCountEvents = 0;
    lines = [];
    comics = [];
    events = [];
    characters = [];

    eventToIndex = {};
    characterToIndex = {};
    comicToIndex = {};
  }

  function setOnDataUpdatedListener(listener){
    onDataUpdated = listener;
  }

  function activateCharacter(identifier, activate){
    var character = characters[characterToIndex[identifier]];
    var character_events = character.getEvents();
    var character_comics = character.getComics();
    var character_lines = character.getLines();
    if(activate){
      character.activate();
      for(var i = 0; i < character_events.length; i++){
        character_events[i].activate();
      }
      for(var i = 0; i < character_comics.length; i++){
        character_comics[i].activate();
      }
      for(var i = 0; i < character_lines.length; i++){
        character_lines[i].activate();
      }
    } else {
      character.deactivate();
      for(var i = 0; i < character_events.length; i++){
        character_events[i].deactivate();
      }
      for(var i = 0; i < character_comics.length; i++){
        character_comics[i].deactivate();
      }
      for(var i = 0; i < character_lines.length; i++){
        character_lines[i].deactivate();
      }
    }

    onDataUpdated(dataForView());
  }

  function resetActive(){
    for(var i = 0; i < characters.length; i++){
      characters[i].deactivate();
    }
    for(var i = 0; i < events.length; i++){
      events[i].deactivate();
    }
    for(var i = 0; i < comics.length; i++){
      comics[i].deactivate();
    }
    for(var i = 0; i < lines.length; i++){
      lines[i].deactivate();
    }
  }

  function activateComic(identifier, activate){
    var comic = comics[comicToIndex[identifier]];
    var comic_events = comic.getEvents();
    var comic_characters = comic.getCharacters();
    var comic_lines = comic.getLines();
    if(activate){
      comic.activate();
      for(var i = 0; i < comic_events.length; i++){
        comic_events[i].activate();
      }
      for(var i = 0; i < comic_characters.length; i++){
        comic_characters[i].activate();
      }
      for(var i = 0; i < comic_lines.length; i++){
        comic_lines[i].activate();
      }
    } else {
      comic.deactivate();
      for(var i = 0; i < comic_events.length; i++){
        comic_events[i].deactivate();
      }
      for(var i = 0; i < comic_characters.length; i++){
        comic_characters[i].deactivate();
      }
      for(var i = 0; i < comic_lines.length; i++){
        comic_lines[i].deactivate();
      }
    }

    onDataUpdated(dataForView());
  }

  function activateEvent(identifier, activate){
    var event = events[eventToIndex[identifier]];
    var event_characters = event.getCharacters();
    var event_comics = event.getComics();
    if(activate){
      event.activate();
      for(var i = 0; i < event_comics.length; i++){
        event_comics[i].activate();
        let event_comic_lines = event_comics[i].getLines();
        for(var j = 0; j < event_comic_lines.length; j++){
          event_comic_lines[j].activate();
        }
      }
      for(var i = 0; i < event_characters.length; i++){
        event_characters[i].activate();
      }
    } else {
      event.deactivate();
      for(var i = 0; i < event_comics.length; i++){
        event_comics[i].deactivate();
        let event_comic_lines = event_comics[i].getLines();
        for(var j = 0; j < event_comic_lines.length; j++){
          event_comic_lines[j].deactivate();
        }
      }
      for(var i = 0; i < event_characters.length; i++){
        event_characters[i].deactivate();
      }
    }

    onDataUpdated(dataForView());
  }


  function setData(value){
    processData(value);
    calculateLayout();
    onDataUpdated(dataForView());
  }

  function processData(data){
    resetModelVariables();
    var comic, event, character, line;

    for(var i = 0; i < data.length; i++){
      comic = createComic(data[i]);

      var comics_events = data[i].events;
      if(comics_events.length == 0){
        event = createEvent(noEvent);
        comic.addEvent(event);
        event.addComic(comic);
        comic.setColor(event.getDisplay().color);
        comicCountEvents += 1;
      }else{
        for(var e = 0; e < comics_events.length; e++){
            event = createEvent(comics_events[e]);
            comic.addEvent(event);
            event.addComic(comic);
            comic.setColor(event.getDisplay().color);
            comicCountEvents += 1;
        }
      }


      var comics_characters = data[i].characters;
      for(var c = 0; c < comics_characters.length; c++){
        character = createCharacter(comics_characters[c]);
        comic.addCharacter(character);
        character.addComic(comic);

        line = new MarvelApp.MarvelModel.Line().init(comic, character);
        lines.push(line);
        character.addLine(line);
        comic.addLine(line);

        if(comics_events.length == 0){
          event = events[eventToIndex[noEvent]];
          event.addCharacter(character);
          character.addEvent(event);
        } else {
          for(var e = 0; e < comics_events.length; e++){
            event = events[eventToIndex[comics_events[e]]];
            event.addCharacter(character);
            character.addEvent(event);
          }
        }
      }
    }
  }

  function createComic(data){
    var comic = new MarvelApp.MarvelModel.Comic().init(data);
    comics.push(comic);
    comicToIndex[comic.getId()] = comics.indexOf(comic);
    return comic;
  }

  function createEvent(data){
    var event_index = eventToIndex[data];
    if(event_index === undefined){
      var event = new MarvelApp.MarvelModel.Event().init(data, colorData.events());
      events.push(event);
      eventToIndex[data] = events.indexOf(event);
      return event;
    } else {
      return events[event_index];
    }
  }

  function createCharacter(data){
    var character_index = characterToIndex[data];
    if(character_index === undefined){
      var character = new MarvelApp.MarvelModel.Character().init(data, colorData.characters);
      characters.push(character);
      characterToIndex[data] = characters.indexOf(character);
      return character;
    } else{
      return characters[character_index];
    }
  }

  function calculateLayout(){
    layout.setData({
      comics:comics,
      events:events,
      characters:characters,
      comicCountEvents:comicCountEvents
    });
    layout.calculateLayout();
  }

  function dataForView(){
    let viewData = {
      comics:[],
      events:[],
      characters:[],
      characters_active: [],
      lines: [],
      lines_active: []
    };
    for(let i = 0; i < comics.length; i++){
      let cComic = comics[i];
      let display = cComic.getDisplay();
      viewData.comics.push({
        r: sizeData.comics.r * ((cComic.isActive()) ? sizeData.comics.active : 1),
        x: display.x,
        y: display.y,
        color: ((cComic.isActive()) ? display.color : colorData.comics),
        name: comics[i].getName(),
        id: comics[i].getId()
      });
    }
    for(let i = 0; i < events.length; i++){
      let cEvent = events[i];
      let display = cEvent.getDisplay();
      viewData.events.push({
        d: display.d,
        stroke_width: sizeData.events.stroke_width * ((cEvent.isActive()) ? sizeData.events.active : 1),
        color: display.color,
        name: events[i].getName(),
        count: events[i].getComicCount()
      });
    }
    for(let i = 0; i < characters.length; i++){
      let cCharacter = characters[i];
      let display = cCharacter.getDisplay();
      let character_data = {
        r: display.r,
        x: display.x,
        y: display.y,
        color: display.color,
        stroke_width: ((cCharacter.isActive()) ? sizeData.characters.active : 0),
        stroke: colorData.character_stroke,
        name: characters[i].getName(),
        count: characters[i].getComicCount()
      }
      if(cCharacter.isActive()){
        viewData.characters_active.push(character_data);
        viewData.characters.push(character_data);
      } else {
        viewData.characters.push(character_data);
      }
    }
    for(let i = 0; i < lines.length; i++){
      let cLine = lines[i];
      let display = cLine.getDisplay();
      let linedata = {
        x_start: display.x_start,
        y_start: display.y_start,
        x_end: display.x_end,
        y_end: display.y_end,
        stroke_width: 1
      }
      if(cLine.isActive()){
        linedata.color = colorData.lines_active;
        viewData.lines_active.push(linedata);
      } else {
        linedata.color = colorData.lines;
        viewData.lines.push(linedata);
      }
    }
    return viewData;
  }

  that.init = init;
  that.setData = setData;
  that.setOnDataUpdatedListener = setOnDataUpdatedListener;
  that.activateCharacter = activateCharacter;
  that.activateComic = activateComic;
  that.activateEvent = activateEvent;
  that.deactivateAll = resetActive;


  return that;
}
