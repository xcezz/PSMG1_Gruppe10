MarvelApp.MarvelModel.Event = function(identifier){
  var that = {},
  description,
  startDate,
  endDate,
  thumbnail,
  url,
  id = identifier;

  function init(data, color){
    description = data.description;
    thumbnail = data.thumbnail;
    startDate = data.start;
    endDate = data.end;

    for(var link = 0; link < data.urls.length; link++){
      if(data.urls[link].type == "detail"){
        url = data.urls[link].url;
      }
    }

    that.display = {
      color: color
    };

    that.isInitialized = true;
    that.name = data.title;
    that.active = false;

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
          name: "Comics:",
          value: that.comics.length
        },
        {
          name: "Characters:",
          value: that.characters.length
        }
      ]
    };
  }

  that.init = init;
  that.getDescriptionData = getDescriptionData;

  that.getId = function(){return id;}
  that.getStart = function(){return new Date(startDate);}

  that.isInitialized = false;
  that.name = undefined;
  that.display = undefined;
  that.comics = [];
  that.active = false;
  that.characters = [];

  return that;
}
