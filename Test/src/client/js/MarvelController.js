MarvelApp.MarvelController = function(){
 "use strict"

 var that = {},

 eventKeys,

 setElementActive,
 deactivateAll,

 showDetail,

 getElementDescriptionData,

 hoverTimeout,

 cTarget;

 function init(keys){
   eventKeys = keys;
   cTarget = {};
   setElementActive = {};
   getElementDescriptionData = {};
 }

 function setDataActivationListeners(activationListeners){
   setElementActive[eventKeys.COMIC] = activationListeners.comicListener;
   setElementActive[eventKeys.CHARACTER] = activationListeners.characterListener;
   setElementActive[eventKeys.EVENT] = activationListeners.eventListener;
   deactivateAll = activationListeners.deactivationListener;
 }

 function setOnShowDescription(listener){
   showDetail = listener;
 }

 function setDataForDescriptionGetter(listeners){
   getElementDescriptionData[eventKeys.EVENT] = listeners.getDescriptionDataEvent;
   getElementDescriptionData[eventKeys.COMIC] = listeners.getDescriptionDataComic;
   getElementDescriptionData[eventKeys.CHARACTER] = listeners.getDescriptionDataCharacter;
 }

 function handleMouseEvent(isIn, eventKey, identifier){
   if(cTarget.eventKey === undefined && cTarget.identifier === undefined){
     clearTimeout(hoverTimeout);
     deactivateAll();
     if(isIn === eventKeys.IN){
       hoverTimeout = setTimeout(function(){
        setElementActive[eventKey](identifier, true);
        showDetail(true, getElementDescriptionData[eventKey](identifier));
       },24);
     } else if(isIn === eventKeys.OUT){
        setElementActive[eventKey](identifier, false);
        showDetail(false);
      }
   }
 }

 function handleClick(eventKey, identifier){
   if(cTarget.eventKey === eventKey && cTarget.identifier === identifier){
     setElementActive[cTarget.eventKey](cTarget.identifier, false);
     showDetail(false);
     cTarget.eventKey = undefined;
     cTarget.identifier = undefined;
   } else {
     if(cTarget.eventKey !== undefined && cTarget.identifier !== undefined){
       setElementActive[cTarget.eventKey](cTarget.identifier, false);
       showDetail(false);
     }
     cTarget.eventKey = eventKey;
     cTarget.identifier = identifier;
     setElementActive[eventKey](identifier, true);
     showDetail(true, getElementDescriptionData[eventKey](identifier));
   }
 }

 that.init = init;
 that.handleMouseEvent = handleMouseEvent;
 that.handleClick = handleClick;
 that.setDataActivationListeners = setDataActivationListeners;
 that.setOnShowDescription = setOnShowDescription;
 that.setDataForDescriptionGetter = setDataForDescriptionGetter;

 return that;
}
