var MarvelDataModel = function(){
  "use strict"
  const CHARACTER_BASE_URI = "http://gateway.marvel.com/v1/public/characters/";

  var that = {},

  comics,
  events,
  characters,

  onEventProcessed,
  onComicProcessed,
  onCharacterProcessed,
  onRemainingCharacterProcessed;

  function init(){
    comics = {};
    events = {};
    characters = {};

    return that;
  }

  function setDataProcessedListener(listeners){
    onEventProcessed = listeners.onEventsReady;
    onComicProcessed = listeners.onComicsReady;
    onCharacterProcessed = listeners.onCharactersReady;
    onRemainingCharacterProcessed = listeners.onRemainingCharactersReady;
  }

  function processEventsData(data){
    for(var eventID in data.data){
      let event = undefined;
      if(events[eventID]){
        event = events[eventID];
      } else {
         event = new MarvelDataModel.Event(eventID);
         events[eventID] = event;
      }
      if(!event.isInitialized){
        event.init(data.data[eventID]);
      }
    }
    onEventProcessed(data.from);
  }

  function processComicsData(data){
    for(var comicID in data.data){
      let comic = undefined;
      if(comics[comicID]){
        comic = comics[comicID];
      } else {
         comic = new MarvelDataModel.Comic(comicID);
         comics[comicID] = comic;
      }
      if(!comic.isInitialized){
        comic.init(data.data[comicID]);
        var comicCharactersObject = data.data[comicID].characters;
        if(comicCharactersObject.returned == comicCharactersObject.available){
          for(var i = 0; i < comicCharactersObject.items.length; i++){
            let character = undefined;
            let characterID = comicCharactersObject.items[i].resourceURI.replace(CHARACTER_BASE_URI,"");
            if(characters[characterID]){
              character = characters[characterID];
            } else {
               character = new MarvelDataModel.Character(characterID);
               characters[characterID] = character;
            }
            comic.addCharacter(characterID);
          }
          comic.charactersReady = true;
        }
      }
      comic.addEvent(data.from);
    }
    onComicProcessed(data.from);
  }

  function processCharactersData(data){
    for(var characterID in data.data){
      let character = undefined;
      if(characters[characterID]){
        character = characters[characterID];
      } else {
         character = new MarvelDataModel.Character(characterID);
         characters[characterID] = character;
      }
      if(!character.isInitialized){
        character.init(data.data[characterID]);
      }
      if(comics[data.from] !== undefined){
        comics[data.from].addCharacter(characterID);
      } else {
        console.log("Character with id " + characterID + " could not be added to comic with id " + data.from + ".\nComic not in list.")
      }
    }
    onCharacterProcessed(data.from);
  }

  function processRemainingCharacterData(data){
    for(var characterID in data.data){
      let character = undefined;
      if(characters[characterID]){
        character = characters[characterID];
      } else {
         character = new MarvelDataModel.Character(characterID);
         characters[characterID] = character;
      }
      if(!character.isInitialized){
        character.init(data.data[characterID]);
      }
    }
    onRemainingCharacterProcessed(data.from);
  }

  function getEventIDs(){
    var eventIDs = [];
    for(var i in events){
      eventIDs.push(i);
    }
    return eventIDs;
  }

  function getComicIDs(){
    var comicIDs = [];
    for(var i in comics){
      if(!comics[i].charactersReady){
        comicIDs.push(i);
      }
    }
    return comicIDs;
  }

  function getCharacterIDs(){
    var characterIDs = [];
    for(var i in characters){
      if(!characters[i].isInitialized){
        characterIDs.push(i);
      }
    }
    return characterIDs;
  }

  function getMergedDataJSON(){
    var dataJSON = {
      comics: [],
      events: [],
      characters: []
    };
    for(var i in comics){
      dataJSON.comics.push(comics[i].toJSON());
    }
    for(var i in events){
      dataJSON.events.push(events[i].toJSON());
    }
    for(var i in characters){
      dataJSON.characters.push(characters[i].toJSON());
    }

    return dataJSON;
  }

  that.init = init;
  that.processEventsData = processEventsData;
  that.processComicsData = processComicsData;
  that.processCharactersData = processCharactersData;
  that.processRemainingCharacterData = processRemainingCharacterData;
  that.setDataProcessedListener = setDataProcessedListener;
  that.getEventIDs = getEventIDs;
  that.getComicIDs = getComicIDs;
  that.getCharacterIDs = getCharacterIDs;
  that.getMergedDataJSON = getMergedDataJSON;

  return that;
}

MarvelDataModel.Comic = function(identifier){
  "use strict"
  var that = {},
  isInitialized = false,
  charactersReady = false,
  id = identifier,
  title,
  description,
  thumbnail,
  urls,
  dates,
  events,
  characters;

  function init(data){
    events = [];
    characters = [];
    title = data.title;
    description = data.description;
    thumbnail = data.thumbnail;
    urls = data.urls;
    dates = data.dates;

    that.isInitialized = true;
    that.charactersReady = false;
  }

  function toJSON(){
    return {
      id: id,
      title: title,
      description: description,
      thumbnail: thumbnail,
      urls: urls,
      dates: dates,
      events: events,
      characters: characters
    };
  }

  function addEvent(eventID){
    if(events.indexOf(eventID) === -1){
      events.push(eventID);
    }
  }

  function addCharacter(characterID){
    if(characters.indexOf(characterID) === -1){
      characters.push(characterID);
    }
  }

  that.init = init;
  that.toJSON = toJSON;
  that.isInitialized = isInitialized;
  that.charactersReady = charactersReady;
  that.addEvent = addEvent;
  that.addCharacter = addCharacter;

  return that;
}

MarvelDataModel.Event = function(identifier){
  "use strict"
  var that = {},
  isInitialized = false,
  id = identifier,
  title,
  description,
  start,
  end,
  thumbnail,
  urls;

  function init(data){
    title = data.title;
    description = data.description;
    start = data.start;
    end = data.end;
    thumbnail = data.thumbnail;
    urls = data.urls;

    that.isInitialized = true;
  }

  function toJSON(){
    return {
      id: id,
      title: title,
      description: description,
      start: start,
      end: end,
      thumbnail: thumbnail,
      urls: urls
    };
  }

  that.init = init;
  that.toJSON = toJSON;
  that.isInitialized = isInitialized;

  return that;
}

MarvelDataModel.Character = function(identifier){
  "use strict"
  var that = {},
  isInitialized = false,
  id = identifier,
  name,
  description,
  thumbnail,
  urls;

  function init(data){
    name = data.name;
    description = data.description;
    thumbnail = data.thumbnail;
    urls = data.urls;

    that.isInitialized = true;
  }

  function toJSON(){
    return {
      id: id,
      name: name,
      description: description,
      thumbnail: thumbnail,
      urls: urls
    };
  }

  that.init = init;
  that.toJSON = toJSON;
  that.isInitialized = isInitialized;

  return that;
}


module.exports = MarvelDataModel;
