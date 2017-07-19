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

    character.active = activate;
    for(var i = 0; i < character.events.length; i++){
      character.events[i].active = activate;
    }
    for(var i = 0; i < character.comics.length; i++){
      character.comics[i].active = activate;
    }
    for(var i = 0; i < character.lines.length; i++){
      character.lines[i].active = activate;
    }

    onDataUpdated(dataForView());
  }

  function resetActive(){
    for(var i = 0; i < characters.length; i++){
      characters[i].active = false;
    }
    for(var i = 0; i < events.length; i++){
      events[i].active = false;
    }
    for(var i = 0; i < comics.length; i++){
      comics[i].active = false;
    }
    for(var i = 0; i < lines.length; i++){
      lines[i].active = false;
    }
  }

  function activateComic(identifier, activate){
    var comic = comics[comicToIndex[identifier]];

    comic.active = activate;
    for(var i = 0; i < comic.events.length; i++){
      comic.events[i].active = activate;
    }
    for(var i = 0; i < comic.characters.length; i++){
      comic.characters[i].active = activate;
    }
    for(var i = 0; i < comic.lines.length; i++){
      comic.lines[i].active = activate;
    }

    onDataUpdated(dataForView());
  }

  function activateEvent(identifier, activate){
    var event = events[eventToIndex[identifier]];

    event.active = activate;
    for(var i = 0; i < event.comics.length; i++){
      event.comics[i].active = activate;

      for(var j = 0; j < event.comics[i].lines.length; j++){
        event.comics[i].lines[j].active = activate;
      }
    }
    for(var i = 0; i < event.characters.length; i++){
      event.characters[i].active = activate;
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

    for(var e = 0; e < data.events.length; e++){
      createEvent(data.events[e].id, data.events[e]);
    }

    for(var c = 0; c < data.characters.length; c++){
      createCharacter(data.characters[c].id, data.characters[c]);
    }

    for(var i = 0; i < data.comics.length; i++){
      comic = createComic(data.comics[i].id, data.comics[i]);

      for(var e = 0; e < data.comics[i].events.length; e++){
        event = createEvent(data.comics[i].events[e]);

        if(comic.events.indexOf(event) === -1){
          comic.events.push(event);
        }

        if(event.comics.indexOf(comic) === -1){
          event.comics.push(comic);
        }

        comic.display.color = event.display.color;
        comicCountEvents += 1;
      }

      for(var c = 0; c < data.comics[i].characters.length; c++){
        character = createCharacter(data.comics[i].characters[c]);

        if(comic.characters.indexOf(character) === -1){
          comic.characters.push(character);
        }

        if(character.comics.indexOf(comic) === -1){
          character.comics.push(comic);
        }

        line = new MarvelApp.MarvelModel.Line().init(comic, character);
        lines.push(line);

        character.lines.push(line);
        comic.lines.push(line);

        for(var e = 0; e < data.comics[i].events.length; e++){
          event = events[eventToIndex[data.comics[i].events[e]]];

          if(event.characters.indexOf(character) === -1){
            event.characters.push(character);
          }

          if(character.events.indexOf(event) === -1){
            character.events.push(event);
          }
        }
      }
    }

    events.sort(function(a,b){return a.getStart() - b.getStart()});
    for(var i = 0; i < events.length; i++){
      eventToIndex[events[i].getId()] = i;
    }

    comics.sort(function(a,b){return events.indexOf(a.events[0]) - events.indexOf(b.events[0])});
    for(var i = 0; i < comics.length; i++){
      comicToIndex[comics[i].getId()] = i;
    }
  }

  function createComic(id, data){
    var comic,
    comic_index = comicToIndex[id];
    if(comic_index === undefined){
      comic = new MarvelApp.MarvelModel.Comic(id),
      comic_index = comics.length;
      comics.push(comic);
      comicToIndex[id] = comic_index;
    } else {
      comic = comics[comic_index];
    }

    if(data != undefined && !comic.isInitialized){
      comic.init(data);
    }

    return comic;
  }

  function createEvent(id, data){
    var event,
    event_index = eventToIndex[id];
    if(event_index === undefined){
      event = new MarvelApp.MarvelModel.Event(id),
      event_index = events.length;
      events.push(event);
      eventToIndex[id] = event_index;
    } else {
      event = events[event_index];
    }

    if(data != undefined && !event.isInitialized){
      event.init(data, colorData.events(event_index));
    }

    return event;
  }

  function createCharacter(id, data){
    var character,
    character_index = characterToIndex[id];
    if(character_index === undefined){
      character = new MarvelApp.MarvelModel.Character(id),
      character_index = characters.length;
      characters.push(character);
      characterToIndex[id] = character_index;
    } else {
      character = characters[character_index];
    }

    if(data != undefined && !character.isInitialized){
      character.init(data);
    }

    return character;
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
      let display = cComic.display;
      viewData.comics.push({
        r: sizeData.comics.r * ((cComic.active) ? sizeData.comics.active : 1),
        x: display.x,
        y: display.y,
        color: ((cComic.active) ? display.color : colorData.comics),
        name: comics[i].name,
        id: comics[i].getId()
      });
    }
    for(let i = 0; i < events.length; i++){
      let cEvent = events[i];
      let display = cEvent.display;
      viewData.events.push({
        id: cEvent.getId(),
        d: display.d,
        stroke_width: sizeData.events.stroke_width * ((cEvent.active) ? sizeData.events.active : 1),
        color: display.color,
        name: events[i].name,
        count: events[i].comics.length,
        lableData: {
          lableRot : display.lableRot,
          lablePos: display.lablePos,
          textAnchor: display.textAnchor,
          name: ((cEvent.active) ? events[i].name : "")
        }
      });
    }
    for(let i = 0; i < characters.length; i++){
      let cCharacter = characters[i];
      let display = cCharacter.display;
      let character_data = {
        id: cCharacter.getId(),
        r: display.r,
        x: display.x,
        y: display.y,
        color: colorData.characters,
        stroke_width: ((cCharacter.active) ? sizeData.characters.active : 0),
        stroke: colorData.character_stroke,
        name: characters[i].name,
        count: characters[i].comics.length
      }
      if(cCharacter.active){
        viewData.characters_active.push(character_data);
        viewData.characters.push(character_data);
      } else {
        viewData.characters.push(character_data);
      }
    }
    for(let i = 0; i < lines.length; i++){
      let cLine = lines[i];
      let linedata = {
        x_start: cLine.comic.display.x,
        y_start: cLine.comic.display.y,
        x_end: cLine.character.display.x,
        y_end: cLine.character.display.y,
        stroke_width: 1
      }
      if(cLine.active){
        linedata.color = colorData.lines_active;
        viewData.lines_active.push(linedata);
      } else {
        linedata.color = colorData.lines;
        viewData.lines.push(linedata);
      }
    }
    return viewData;
  }
  function getEventDescriptionData(identifier){
    return events[eventToIndex[identifier]].getDescriptionData();
  }
  function getComicDescriptionData(identifier){
    return comics[comicToIndex[identifier]].getDescriptionData();
  }
  function getCharacterDescriptionData(identifier){
    return characters[characterToIndex[identifier]].getDescriptionData();
  }

  that.init = init;
  that.setData = setData;
  that.setOnDataUpdatedListener = setOnDataUpdatedListener;
  that.activateCharacter = activateCharacter;
  that.activateComic = activateComic;
  that.activateEvent = activateEvent;
  that.deactivateAll = resetActive;
  that.getEventDescriptionData = getEventDescriptionData;
  that.getComicDescriptionData = getComicDescriptionData;
  that.getCharacterDescriptionData = getCharacterDescriptionData;


  return that;
}
