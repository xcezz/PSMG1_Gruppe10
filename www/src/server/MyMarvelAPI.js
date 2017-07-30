module.exports = function(){
  "use strict"
  const ID_TYPES = {
    EVENT: "Event",
    CHARACTER: "Character",
    COMIC: "Comic"
  };

  var that = {},

  marvel,

  maxAmount,

  onEventsFormCharacterIDFinished,
  onComicsFromEventIDFinished,
  onCharacterFromComicIDFinished,
  onCharacterFromIDFinished,
  onError;

  function init(marvel_api_req, amountPerCall){
    marvel = marvel_api_req.createClient({
      publicKey: '',
      privateKey: ''
    });

    maxAmount = amountPerCall;
    return that;
  }

  function setDataFetchedListener(listeners){
    onEventsFormCharacterIDFinished = listeners.onEventsReady;
    onComicsFromEventIDFinished = listeners.onComicsReady;
    onCharacterFromComicIDFinished = listeners.onCharactersReady;
    onCharacterFromIDFinished = listeners.onRemainingCharactersReady;
    onError = listeners.onError;
  }

  function getEventsFromCharacterID(id){
    let container = {
      from:id,
      data:{}
    };

    getAllElementsByID(
      id,
      marvel.characters.events,
      container,
      onEventsFormCharacterIDFinished,
      ID_TYPES.CHARACTER
    );
  }

  function getComicsFromEventID(id){
    let container = {
      from:id,
      data:{}
    };
    getAllElementsByID(
      id,
      marvel.events.comics,
      container,
      onComicsFromEventIDFinished,
      ID_TYPES.EVENT
    );
  }


  function getCharactersFromComicID(id){
    let container = {
      from:id,
      data:{}
    };
    getAllElementsByID(
      id,
      marvel.comics.characters,
      container,
      onCharacterFromComicIDFinished,
      ID_TYPES.COMIC
    );
  }

  function getCharacterFromID(id){
    let container = {
      from:id,
      data:{}
    };
    getSingleElementByID(
      id,
      marvel.characters.find,
      container,
      onCharacterFromIDFinished,
      ID_TYPES.CHARACTER
    );
  }

  function getAllElementsByID(id, APIFunction, container, onFinished, fromIdType){
    let callInfo = {
      finished: 0,
      todo: -1
    };
    APIFunction(id, maxAmount, callInfo.finished, function(err, results) {
      if (err) {
        onError(err, id, fromIdType);
      } else {
        callInfo.todo = results.meta.total;
        callInfo.finished += results.meta.count;
        handleResults(results.data, container);
        getRemainingElementsById(id, APIFunction, callInfo, container, onFinished, fromIdType);
      }
    });
  }

  function getRemainingElementsById(id, APIFunction, callInfo, container, onFinished){
    if(callInfo.todo != callInfo.finished){
      APIFunction(id, maxAmount, callInfo.finished, function(err, results) {
        if (err) {
          onError(err, id, fromIdType);
        } else {
          callInfo.finished += results.meta.count;
          handleResults(results.data, container);
          if(callInfo.todo == callInfo.finished){
            onFinished(container);
          } else {
            getRemainingElementsById(id, APIFunction, callInfo.finished, callInfo, container, onFinished)
          }
        }
      });
    } else {
      onFinished(container);
    }
  }

  function getSingleElementByID(id, APIFunction, container, onFinished, fromIdType){
    APIFunction(id, function(err, results) {
      if (err) {
        onError(err, id, fromIdType);
      } else {
        handleResults(results.data, container);
        onFinished(container);
      }
    });
  }

  function handleResults(data, container){
    for(var i = 0; i < data.length; i++){
      var element = data[i];
      if(container.data[element.id] === undefined){
        container.data[element.id] = element;
      }
    }
  }

  that.init = init;
  that.setDataFetchedListener = setDataFetchedListener;
  that.getEventsFromCharacterID = getEventsFromCharacterID;
  that.getComicsFromEventID = getComicsFromEventID;
  that.getCharactersFromComicID = getCharactersFromComicID;
  that.getCharacterFromID = getCharacterFromID;

  return that;
}
