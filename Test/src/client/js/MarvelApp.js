MarvelApp = function(){
  "use strict"

  var that = {},
  model,
  view,
  controller;

  const size = {
    width: 1200,
    height: 810
  },
  domData = {
    svg: "svg",
    events: ".arc",
    lines: ".lines",
    lines_active: ".lines_active",
    characters: ".heroes",
    characters_active: ".heroes_active",
    comics: ".comics"
  },
  layoutSizeData = {
    chart: {
      centerX: size.width / 2,
      centerY: size.height / 2
    },
    events: {
      radius: 380,
      spacing: 0.4 //°
    },
    comics: {
      radius: 280,
      comicsPerRow: 6,
      comicRowSpacing: 10
    },
    characters: {
      diameter: 500
    }
  },
  colorData = {
    comics: "rgb(0,0,0);",
    events: function(){return "rgb(" + Math.round(Math.random() * 255) + "," + Math.round(Math.random() * 255) + "," + Math.round(Math.random() * 255) + ")"},
    characters: "rgba(240,20,30,1)",
    character_stroke: "rgba(0,0,0,1)",
    lines: "rgba(0,0,0,0.1)",
    lines_active: "rgba(0,0,0,1)"
  },
  eventKeys = {
    IN: 0,
    OUT: 1,
    EVENT: 2,
    CHARACTER: 3,
    COMIC: 4
  },
  elementSizeData = {
    events: {
      active: 1.5,
      stroke_width: 40
    },
    comics: {
      active: 2,
      r: 3
    },
    characters: {
      active: 1.5
    },
    lines:{
      stroke_width: 1,
      active: 1.5
    }
  };

  function init(){
    initModules();
    initListeners();

    getData();
  }

  function initModules(){
    model = new MarvelApp.MarvelModel();
    view = new MarvelApp.MarvelView();
    controller = new MarvelApp.MarvelController();

    model.init(layoutSizeData,colorData,elementSizeData);
    view.init(domData, eventKeys);
    controller.init(eventKeys);
  }

  function initListeners(){
    model.setOnDataUpdatedListener(view.renderData);
    view.setMouseEventHandler(controller.handleMouseEvent);
    controller.setDataActivationListeners({
      comicListener: model.activateComic,
      characterListener: model.activateCharacter,
      eventListener: model.activateEvent,
      deactivationListener: model.deactivateAll
    });
  }

  function getData(){
    // call to server
    // response <= data
    d3.json("data/avengerevents.json", function(error,result){
      model.setData(result);
    });
  }

  that.init = init;

  return that;
}();
