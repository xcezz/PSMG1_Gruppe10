MarvelApp.MarvelModel.MyLayout = function(size){
  var that = {},

  comics,
  events,
  characters,

  sizeData = size,

  comicCountEvents; //comics mit mehreren Events zählen mehrfach

  function setData(data){
    comics = data.comics;
    events = data.events;
    characters = data.characters;
    comicCountEvents = data.comicCountEvents;

    return that;
  }

  function calculateLayout(){
    calcEventArc();
    calcCharcterBubbles();
    calcComicBubbles();
  }

  function calcEventArc(){
    var start = 0;
    var l = events.length;
    var degreesWithoutSpacing = 360 - l * sizeData.events.spacing;
    var degreePerComic = degreesWithoutSpacing / comicCountEvents;
    for(var i = 0; i < l; i++){
      var end = start + events[i].comics.length * degreePerComic,
      halfPoint = polarToCartesian(
        sizeData.chart.centerX,
        sizeData.chart.centerY,
        sizeData.events.radius + sizeData.events.stroke_width / 2 + sizeData.events.lableSpacing,
        start + (end - start) / 2
      ),
      halfRot = start + (end - start) / 2;

      if(halfRot > 180){
        halfRot += 90;
      } else {
        halfRot -= 90;
      }

      events[i].display.d = describeArc(
        sizeData.chart.centerX,
        sizeData.chart.centerY,
        sizeData.events.radius,
        start,
        end
      );

      events[i].display.lablePos = halfPoint;
      events[i].display.lableRot = halfRot;

      start = end + sizeData.events.spacing;
    }
  }

  function calcCharcterBubbles(){
    var pack = d3.pack().size([
      sizeData.characters.diameter,
      sizeData.characters.diameter
    ]);

    var hierarchy = {children:[]};
    for(var i = 0; i < characters.length; i++){
      hierarchy.children[i] = {
        index: i,
        count: characters[i].comics.length
      }
    }


    var root = d3.hierarchy(hierarchy)
      .sum(function(d) { return d.count; })
      .sort(function(a, b) { return b.value - a.value; });

    her_lay = pack(root).descendants();

    for(var i = 0; i < her_lay.length; i ++){
      if(!her_lay[i].children){
        var layout_obj_character = her_lay[i];
        characters[layout_obj_character.data.index].display.r = layout_obj_character.r;
        characters[layout_obj_character.data.index].display.x = layout_obj_character.x + sizeData.chart.centerX - sizeData.characters.diameter/2;
        characters[layout_obj_character.data.index].display.y = layout_obj_character.y + sizeData.chart.centerY - sizeData.characters.diameter/2;
      }
    }
  }

  function calcComicBubbles(){
    var length = comics.length;
    var steps = Math.ceil(length / sizeData.comics.comicsPerRow);
    var degreesPerStep = 360 / steps;
    for(var i = 0; i < comics.length; i ++){
      var point = polarToCartesian(
        sizeData.chart.centerX,
        sizeData.chart.centerY,
        sizeData.comics.radius + (i % sizeData.comics.comicsPerRow) * sizeData.comics.comicRowSpacing,
        Math.floor(i / sizeData.comics.comicsPerRow) * degreesPerStep + (i % sizeData.comics.comicsPerRow) * sizeData.comics.offsetPerRow
      );
      comics[i].display.x = point.x;
      comics[i].display.y = point.y;
    }
  }

  function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }

  function describeArc(x, y, radius, startAngle, endAngle){

      var start = polarToCartesian(x, y, radius, endAngle);
      var end = polarToCartesian(x, y, radius, startAngle);

      var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

      var d = [
          "M", start.x, start.y,
          "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
      ].join(" ");

      return d;
  }


  that.setData = setData;
  that.calculateLayout = calculateLayout;

  return that;
}
