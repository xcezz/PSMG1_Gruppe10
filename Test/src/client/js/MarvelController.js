MarvelApp.MarvelController = function(){
 "use strict"

 var that = {},

 eventKeys,

 setCharacterActive,
 setEventActive,
 setComicActive,
 deactivateAll,

 hoverTimeout;

 function init(keys){
   eventKeys = keys;
 }

 function setDataActivationListeners(activationListeners){
   setComicActive = activationListeners.comicListener;
   setCharacterActive = activationListeners.characterListener;
   setEventActive = activationListeners.eventListener;
   deactivateAll = activationListeners.deactivationListener;
 }

 function handleMouseEvent(isIn, eventKey, identifier){
   clearTimeout(hoverTimeout);
   deactivateAll();
   if(isIn === eventKeys.IN){
     hoverTimeout = setTimeout(function(){
       switch(eventKey){
         case eventKeys.EVENT:
          setEventActive(identifier, true);
          break;
         case eventKeys.COMIC:
          setComicActive(identifier, true);
          break;
         case eventKeys.CHARACTER:
          setCharacterActive(identifier, true);
          break;
         default:
          break;
       }
     },24);
   } else if(isIn === eventKeys.OUT){
     switch(eventKey){
       case eventKeys.EVENT:
        setEventActive(identifier, false);
        break;
       case eventKeys.COMIC:
        setComicActive(identifier, false);
        break;
       case eventKeys.CHARACTER:
        setCharacterActive(identifier, false);
        break;
       default:
        break;
      }
   }
 }

 that.init = init;
 that.handleMouseEvent = handleMouseEvent;
 that.setDataActivationListeners = setDataActivationListeners;

 return that;
}
