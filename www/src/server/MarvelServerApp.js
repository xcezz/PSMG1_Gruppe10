module.exports = function(marvel_api_req, myMarvelAPI_req, marvelDataModel_req){
  "use strict"
  const AVENGERS_API_ID = "1009165",
  maxAmountPerAPICall = 100;

  var that = {},
  marvel_api_module = marvel_api_req,
  myMarvelAPI_module = myMarvelAPI_req,
  marvelDataModel_module = marvelDataModel_req,

  marvelModel,
  marvelAPI,

  todo,
  done,

  infointerval, // feedback every 10 seconds how many responses remaining
  errors, // holding errors occured on requests

  onDataFetchProcessDone, // -> server.js
  onDataFetchProcessFailed; // -> server.js

  function init(){
    initModules();
    initListeners();
    todo = { // calls todo on MyMarvelAPI module for data:
      events: 0, // calls todo for event data (by character ID)
      comics: 0, // calls todo for comic data (by event ID)
      characters: 0, // calls todo for character data (by comic ID)
      remainingCharacters: 0 // calls todo for charecter data (by character ID)
    };
    done = { // calls with data from responses processed successfully
      events: 0,
      comics: 0,
      characters: 0,
      remainingCharacters: 0
    };

    errors = {};

    return that;
  }

  function initModules(){
    marvelAPI = myMarvelAPI_module().init(marvel_api_module, maxAmountPerAPICall);
    marvelModel = marvelDataModel_module().init();
  }

  // setup structure for
  // marvelServerApp -> call to MyMarvelAPI -. marvel-api .-> paste response data into container
  // -> process data in MarvelDataModel -> notify marvelServerApp -> next calls
  function initListeners(){
    marvelAPI.setDataFetchedListener({
      onEventsReady: marvelModel.processEventsData,
      onComicsReady: marvelModel.processComicsData,
      onCharactersReady: marvelModel.processCharactersData,
      onRemainingCharactersReady: marvelModel.processRemainingCharacterData,
      onError: handleError
    });

    marvelModel.setDataProcessedListener({
      onEventsReady: handleEventProcessed,
      onComicsReady: handleComicProcessed,
      onCharactersReady: handleCharacterProcessed,
      onRemainingCharactersReady: handleRemainingCharacterProcessed
    });
  }


  function getAvengerData(onSucess, onFail){
    errors = {
      count: 0,
      errors: {}
    }

    setInfoInterval();

    console.log("start fetching avenger data");
    onDataFetchProcessDone = onSucess;
    onDataFetchProcessFailed = onFail;

    todo.events = 1;
    done.events = 0;
    console.log("start fetching event data for " + todo.events + " character.");
    marvelAPI.getEventsFromCharacterID(AVENGERS_API_ID);
  }

  function setInfoInterval(){
    infointerval = setInterval(function(){
      if(todo.events > 0){
        console.log("event data processed " + done.events +"/" + todo.events);
      }
      if(todo.comics > 0){
        console.log("comic data processed " + done.comics +"/" + todo.comics);
      }
      if(todo.characters > 0){
        console.log("character data processed " + done.characters + "/" + todo.characters);
      }
      if(todo.remainingCharacters > 0){
        console.log("remaining character data processed " + done.remainingCharacters + "/" + todo.remainingCharacters);
      }
      if(errors.count > 0){
        clearInterval(infointerval);
      }
    },10000);
  }

  // event data processed
  // from represents the id of the element (character) the data was requested
  // if all requested data is processed go to next level
  function handleEventProcessed(from){
    if(errors.count === 0){
      done.events += 1;

      if(done.events == todo.events){
        var eventIDList = marvelModel.getEventIDs();

        todo.comics = eventIDList.length;
        done.comics = 0;
        console.log("start fetching comic data for " + todo.comics + " events.");
        for(let i = 0; i < todo.comics; i++){
          let currentEventID = eventIDList[i];
          setTimeout(function(){
            marvelAPI.getComicsFromEventID(currentEventID);
          },i * 100);
        }
      }
    }
  }

  // comic data processed
  // from represents the id of the element (event) the data was requested
  // if all requested data is processed go to next level
  function handleComicProcessed(from){
    missing[from] = undefined;
    if(errors.count === 0){
      done.comics += 1;

      if(done.comics == todo.comics){
        var comicIDList = marvelModel.getComicIDs();

        todo.characters = comicIDList.length;
        done.characters = 0;
        console.log("start fetching character data for " + todo.characters + " comics.");
        for(let i = 0; i < todo.characters; i++){
          let currentComicID = comicIDList[i];
          setTimeout(function(){
            marvelAPI.getCharactersFromComicID(currentComicID);
          },i * 100);
        }
      }
    }
  }

  // character data processed
  // from represents the id of the element (comic) the data was requested
  // if all requested data is processed go to next level
  function handleCharacterProcessed(from){
    if(errors.count === 0){
      done.characters += 1;
      if(done.characters == todo.characters){
        var charactersIDList = marvelModel.getCharacterIDs();

        todo.remainingCharacters = charactersIDList.length;
        done.remainingCharacters = 0;
        console.log("start fetching remaining character data for " + todo.remainingCharacters + " characters.");
        for(let i = 0; i < todo.remainingCharacters; i++){
          let currentCharacterID = charactersIDList[i];
          setTimeout(function(){
            marvelAPI.getCharacterFromID(currentCharacterID);
          },i * 100);
        }
      }
    }
  }

  // character data processed
  // from represents the id of the element (character) the data was requested
  // if all requested data is processed notify server.js
  function handleRemainingCharacterProcessed(from){
    if(errors.count === 0){
      done.remainingCharacters += 1;
      if(done.remainingCharacters == todo.remainingCharacters){
        clearInterval(infointerval);
        onDataFetchProcessDone(marvelModel.getMergedDataJSON());
      }
    }
  }

  function handleError(err, fromID, fromType){
    errors.count += 1;
    console.log(err);
    if(errors.errors[fromType] === undefined){
      errors.errors[fromType] = {};
    }
    errors.errors[fromType][fromID] = err;
    onDataFetchProcessFailed(errors);
  }

  that.init = init;
  that.getAvengerData = getAvengerData;

  return that;
}
