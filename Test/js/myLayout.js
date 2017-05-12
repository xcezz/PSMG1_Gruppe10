var MyLayout = function(){
  var that = {},
  comics,
  events,
  characters,
  arcdata,
  lines,
  characterBubbleData,
  comicCountEvents, //comics mit mehreren Events zählen mehrfach

  setData = function(data){
    comics = data.comics;
    events = data.events;
    characters = data.characters;
    comicCountEvents = data.comicCountEvents;
    lines = data.lines;
    arcdata = {
      centerX: 600,
      centerY: 405
    };
    eventArcData = {
      radius: 380,
      stroke_width: 40,
      spacing: 0.4 //°
    };
    comicArcData = {
      radius: 280,
      size: 3
    };
    characterBubbleData = {
      diameter: 500
    };

    return that;
  },

  calculateLayout = function(){
    calcEventArc();
    calcCharcterBubbles();
    calcComicBubbles();
    calcLines();
  },

  calcEventArc = function(){
    var start = 0;
    for(var i = 0; i < events.length; i++){
      var end = start + events[i].getComicCount() / comicCountEvents * (360 - (events.length) * eventArcData.spacing);
      var half = start + events[i].getComicCount() / 2 / comicCountEvents * (360 - (events.length) * eventArcData.spacing);
      var halfpoint = polarToCartesian(arcdata.centerX, arcdata.centerY, eventArcData.radius - eventArcData.stroke_width/2, half);
      events[i].setDisplay({
        d:describeArc(arcdata.centerX, arcdata.centerY, eventArcData.radius, start, end),
        color: "rgb(" + Math.round(Math.random() * 255) + "," + Math.round(Math.random() * 255) + "," + Math.round(Math.random() * 255) + ")",
        stroke_width: eventArcData.stroke_width,
        x: halfpoint.x,
        y: halfpoint.y
      });
      start = end + eventArcData.spacing;
    }
  },

  calcCharcterBubbles = function(){
    var pack = d3.pack().size([characterBubbleData.diameter,characterBubbleData.diameter]);

    var hierarchy = {children:[]};
    for(var i = 0; i < characters.length; i++){
      hierarchy.children[i] = {index: i, count: characters[i].getComicCount()}
    }


    var root = d3.hierarchy(hierarchy)
      .sum(function(d) { return d.count; })
      .sort(function(a, b) { return b.value - a.value; });

    her_lay = pack(root).descendants();

    for(var i = 0; i < her_lay.length; i ++){
      if(!her_lay[i].children){
        var layout_obj_character = her_lay[i];
        characters[layout_obj_character.data.index].setDisplay({
          r: layout_obj_character.r,
          x: layout_obj_character.x + arcdata.centerX - characterBubbleData.diameter/2,
          color: "rgba(" + Math.round(Math.random() * 255) + "," + Math.round(Math.random() * 255) + "," + Math.round(Math.random() * 255) + ",0.7)",
          y: layout_obj_character.y + arcdata.centerY - characterBubbleData.diameter/2
        });
      }
    }
  },

  calcComicBubbles = function(){
    for(var i = 0; i < comics.length; i ++){
      var point = polarToCartesian(arcdata.centerX, arcdata.centerY, comicArcData.radius + (i % 6) * 10, i/(comics.length)*360);
      comics[i].setDisplay({
        x: point.x,
        y: point.y,
        color: "black",
        r: comicArcData.size
      });
    }
  },

  calcLines = function(){
    /*for(var i = 0; i < events.length; i++){
      var ev_comics = events[i].getComics();
      for(var j = 0; j < ev_comics.length; j++){
        lines.push({
          x_start: events[i].getDisplay().x,
          y_start: events[i].getDisplay().y,
          x_end: ev_comics[j].getDisplay().x,
          y_end: ev_comics[j].getDisplay().y,
          color: "black"
        });
      }
    }*/
    for(var i = 0; i < characters.length; i++){
      var character_comics = characters[i].getComics();
      for(var j = 0; j < character_comics.length; j++){
        lines.push({
          x_start: characters[i].getDisplay().x,
          y_start: characters[i].getDisplay().y,
          x_end: character_comics[j].getDisplay().x,
          y_end: character_comics[j].getDisplay().y,
          color: "rgba(0,0,0,0.1)",
          character: characters[i],
          comic: character_comics[j]
        });
      }
    }
  },

  polarToCartesian = function(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  },

  describeArc = function(x, y, radius, startAngle, endAngle){

      var start = polarToCartesian(x, y, radius, endAngle);
      var end = polarToCartesian(x, y, radius, startAngle);

      var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

      var d = [
          "M", start.x, start.y,
          "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
      ].join(" ");

      return d;
  };


  that.setData = setData;
  that.calculateLayout = calculateLayout;

  return that;
}
