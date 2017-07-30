MarvelApp.MarvelModel.Comic = function(identifier){
  var that = {},
  description,
  thumbnail,
  date,
  url,
  id = identifier;

  function init(data){
    description = data.description;
    thumbnail = data.thumbnail;

    for(var link = 0; link < data.urls.length; link++){
      if(data.urls[link].type == "detail"){
        url = data.urls[link].url;
      }
    }

    for(var d = 0; d < data.dates.length; d++){
      if(data.dates[d].type == "onsaleDate"){
        date = data.dates[d].date;
      }
    }


    that.active = false;
    that.display = {}
    that.isInitialized = true;
    that.name = data.title;

    return that;
  }

  function getDescriptionData(){
    if(thumbnail.path != undefined){
      let img = new Image();
      img.src = thumbnail.path + "/landscape_incredible." + thumbnail.extension;
      thumbnail = img;
    }
    return {
      name: that.name,
      description: description,
      thumbnail: thumbnail,
      url: url,
      dataInfo: [
        {
          name: "Characters:",
          value: that.characters.length
        },
        {
          name: "Events:",
          value: that.events.length
        }
      ]
    };
  }

  that.init = init;
  that.getDescriptionData = getDescriptionData;

  that.getId = function(){return id;}
  that.getDate = function(){return new Date(date);}

  that.isInitialized = false;
  that.name = undefined;
  that.display = undefined;
  that.characters = [];
  that.events = [];
  that.lines = [];
  that.active = false;


  return that;
}
