MarvelApp.MarvelModel.Character = function(identifier){
  var that = {},
  description,
  thumbnail,
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

    that.active = false;
    that.display = {};
    that.name = data.name;
    that.isInitialized = true;

    return that;
  }

  function getDescriptionData(){
    if(thumbnail.path != undefined){
      let img = new Image();
      img.src = thumbnail.path + "/landscape_incredible." + thumbnail.extension;
      thumbnail = img;
    }
    return {
      name: name,
      description: description,
      thumbnail: thumbnail,
      url: url,
      dataInfo: [
        {
          name: "Comics:",
          value: that.comics.length
        },
        {
          name: "Events:",
          value: that.events.length
        }
      ]
    };
  }

  that.init = init;

  that.isInitialized = false;
  that.name = undefined;
  that.display = undefined;
  that.comics = [];
  that.events = [];
  that.lines = [];
  that.active = false;

  that.getId = function(){return id;}
  that.getDescriptionData = getDescriptionData;

  return that;
}
