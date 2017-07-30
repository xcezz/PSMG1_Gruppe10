MarvelApp = function(){
  "use strict"

  var that = {},
  model,
  view,
  controller;

  const DATA_URL = window.location.href + "data",
  size = {
    width: 800,
    height: 800,
    spacing: {
      left: 100,
      top: 100
    }
  },
  domData = {
    svg: "svg",
    events: ".arc",
    lines: ".lines",
    lines_active: ".lines_active",
    characters: ".heroes",
    characters_active: ".heroes_active",
    comics: ".comics",
    hero_description_id: "hero-description",
    description_image_id: "description_image",
    description_name_id: "description_name",
    description_description_id: "description_description",
    description_link: "wiki-link",
    description_dataInfoName_1: "dataInfoName_1",
    description_dataInfoValue_1: "dataInfoValue_1",
    description_dataInfoName_2: "dataInfoName_2",
    description_dataInfoValue_2: "dataInfoValue_2"
  },
  elementSizeData = {
    events: {
      active: 1.5,
      stroke_width: 40
    },
    comics: {
      active: 1.2,
      r: 3
    },
    characters: {
      active: 1.5
    },
    lines:{
      stroke_width: 1,
      active: 1.5
    }
  },
  layoutSizeData = {
    chart: {
      centerX: size.width / 2 + size.spacing.left,
      centerY: size.height / 2 + size.spacing.top
    },
    events: {
      radius: 340,
      spacing: 0.4, //°
      stroke_width: elementSizeData.events.stroke_width * elementSizeData.events.active,
      lableSpacing: 65
    },
    comics: {
      radius: 250,
      comicsPerRow: 6,
      comicRowSpacing: 10,
      offsetPerRow: 0
    },
    characters: {
      diameter: 450
    }
  },
  colorData = {
    comics: "rgb(0,0,0);",
    events: function(index){
      let palette = [
        "rgb(181,89,30)",
        "rgb(62,21,222)",
        "rgb(232,20,51)",
        "rgb(199,163,27)",
        "rgb(228,227,219)",
        "rgb(249,15,66)",
        "rgb(168,41,3)",
        "rgb(211,132,114)",
        "rgb(98,139,207)",
        "rgb(51,205,191)",
        "rgb(104,44,66)",
        "rgb(103,144,174)",
        "rgb(157,210,99)",
        "rgb(20,40,96)",
        "rgb(12,215,129)",
        "rgb(233,150,115)",
        "rgb(130,183,55)",
        "rgb(198,206,68)",
        "rgb(240,14,201)",
        "rgb(247,87,52)",
        "rgb(239,115,235)",
        "rgb(97,129,37)",
        "rgb(77,197,187)",
        "rgb(165,160,144)",
        "rgb(39,54,218)",
        "rgb(207,189,80)",
        "rgb(97,52,70)",
        "rgb(104,101,68)",
        "rgb(19,76,223)",
        "rgb(30,228,8)",
        "rgb(84,61,35)",
        "rgb(154,76,38)"
      ];
      try{
        return palette[index];
      } catch(e){
        return "rgb(0,0,0);"
      }
    },
    characters: "rgba(240,20,30,1)",
    character_stroke: "rgba(0,0,0,1)",
    lines: "rgba(0,0,0,0.1)",
    lines_active: "rgba(0,0,0,0.8)"
  },
  eventKeys = {
    IN: 0,
    OUT: 1,
    EVENT: 2,
    CHARACTER: 3,
    COMIC: 4
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
    view.setMouseEventHandlers({
      onmousemoved: controller.handleMouseEvent,
      onclick: controller.handleClick
    });
    controller.setDataActivationListeners({
      comicListener: model.activateComic,
      characterListener: model.activateCharacter,
      eventListener: model.activateEvent,
      deactivationListener: model.deactivateAll
    });
    controller.setOnShowDescription(view.showDetail);
    controller.setDataForDescriptionGetter({
     getDescriptionDataEvent: model.getEventDescriptionData,
     getDescriptionDataComic: model.getComicDescriptionData,
     getDescriptionDataCharacter: model.getCharacterDescriptionData
    });
  }

  function getData(){
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
      if (req.readyState == 4 && req.status == 200){
        model.setData(JSON.parse(req.responseText));
      }
    }
    req.open("GET", DATA_URL, true);
    req.send(null);
  }

  that.init = init;

  return that;
}();
