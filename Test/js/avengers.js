var d3 = d3 || {},
data,
comics = [],
events = [],
characters = [],
eventToIndex = {},
characterToIndex = {},
comicToIndex = {},
lines = [],
comicCountEvents = 0,
layout;

d3.json("data/avengerevents.json", function(error,result){
  data = result;
  setUpData();
  setUpLayout();
  setTimeout(function(){doChart();},100);
});

function setUpData(){
  for(var i = 0; i < data.length; i++){
    var comic = new Comic().init(data[i]);
    comics.push(comic);
    comicToIndex[comic.getId] = i;

    var es = data[i].events;
    if(es.length == 0){
      var e_string = "No Event";
      if(eventToIndex[e_string] == undefined){
        var event = new Event().init(e_string);
        events.push(event);
        eventToIndex[event.getName()] = events.indexOf(event);
      }
      comic.addEvent(events[eventToIndex[e_string]]);
      events[eventToIndex[e_string]].addComic(comic);
      comicCountEvents += 1;
    }else{
      for(var e = 0; e < es.length; e++){
        var e_string = es[e];
        if(eventToIndex[e_string] == undefined){
          var event = new Event().init(e_string);
          events.push(event);
          eventToIndex[event.getName()] = events.indexOf(event);
        }
        comic.addEvent(events[eventToIndex[e_string]]);
        events[eventToIndex[e_string]].addComic(comic);
        comicCountEvents += 1;
      }
    }


    var cs = data[i].characters;
    for(var c = 0; c < cs.length; c++){
      var c_string = cs[c];
      if(characterToIndex[c_string] == undefined){
        var character = new Character().init(c_string);
        characters.push(character);
        characterToIndex[character.getName()] = characters.indexOf(character);
      }
      comic.addCharacter(characters[characterToIndex[c_string]]);
      characters[characterToIndex[c_string]].addComic(comic);

      if(es.length == 0){
        var e_string = "No Event";
        events[eventToIndex[e_string]].addCharacter(characters[characterToIndex[c_string]]);
        characters[characterToIndex[c_string]].addEvent(events[eventToIndex[e_string]]);
      } else {
        for(var e = 0; e < es.length; e++){
          var e_string = es[e];
          events[eventToIndex[e_string]].addCharacter(characters[characterToIndex[c_string]]);
          characters[characterToIndex[c_string]].addEvent(events[eventToIndex[e_string]]);
        }
      }
    }
  }
}

function setUpLayout(){
  layout = new MyLayout();
  layout.setData({
    comics:comics,
    events:events,
    characters:characters,
    comicCountEvents:comicCountEvents,
    lines: lines
  });
  layout.calculateLayout();
}

function doChart() {
    "use strict";
    var svg = d3.select("svg");
    var arc = svg.select(".arc");
    var lines_g = svg.select(".lines");
    var heroes_g = svg.select(".heroes");
    var comic_g = svg.select(".comics");

    var arc_node = arc.selectAll(".arc_node")
    .data(events)
    .enter().append("g");

    arc_node.append('path')
    .attr('d', function(d){return d.getDisplay().d;})
    .attr('stroke', function(d){return d.getDisplay().color;})
    .attr('stroke-width', function(d){return d.getDisplay().stroke_width;})
    .attr("fill", function(d) { return "none"; })
    .attr("class", function(d) { return "arc_node"; });

    arc_node.append("title")
    .text(function(d) { return d.getName() + "\n" + d.getComicCount(); });

    var line_node = lines_g.selectAll(".line_node")
    .data(lines)
    .enter().append("g");

    line_node.append('path')
    .attr('d', function(d){return "M" + d.x_start + " " + d.y_start + " L " + d.x_end + " " + d.y_end;})
    .attr('stroke', function(d){return d.color;})
    .attr('stroke-width', function(d){return "1";})
    .attr("class", function(d) { return "line_node"; });


    var comic_node = comic_g.selectAll(".comic_node")
    .data(comics);

    var comic_node_enter = comic_node
    .enter().append("g");

    comic_node_enter.append('circle')
    .attr("r", function(d) { return d.getDisplay().r; })
    .attr("cx", function(d) { return d.getDisplay().x; })
    .attr("cy", function(d) { return d.getDisplay().y; })
    .attr("style", function(d) { return "fill: " + d.getDisplay().color; })
    .attr("class", function(d) { return "comic_node"; });

    comic_node_enter.append("title")
    .text(function(d) { return d.getName() });


    var heroe_node = heroes_g.selectAll(".heroe_node")
    .data(characters);

    var heroe_node_enter = heroe_node.enter().append("g");

    heroe_node_enter.append('circle')
    .attr("r", function(d) { return d.getDisplay().r; })
    .attr("cx", function(d) { return d.getDisplay().x; })
    .attr("cy", function(d) { return d.getDisplay().y; })
    .attr("style", function(d) { return "fill: " + d.getDisplay().color; })
    .attr("class", function(d) { return "heroe_node"; })
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);

    heroe_node_enter.append("title")
    .text(function(d) { return d.getName() + "\n" + d.getComicCount(); });

    function handleMouseOver(d, i) {
      d.getDisplay().r *= 1.2;
      var cs = d.getComics();
      var es = d.getEvents();
      for (var i = 0; i < cs.length; i++){
        cs[i].getDisplay().r *= 2;
      }
      for (var i = 0; i < es.length; i++){
        es[i].getDisplay().stroke_width = "50";
      }
      d3.selectAll(".heroe_node").attr("r", function(d){ return d.getDisplay().r;});
      d3.selectAll(".comic_node").attr("r", function(d){ return d.getDisplay().r;});
      d3.selectAll(".arc_node").attr("stroke-width", function(d){ return d.getDisplay().stroke_width;});

    }

  function handleMouseOut(d, i) {
      d.getDisplay().r /= 1.2;
      var cs = d.getComics();
      var es = d.getEvents();
      for (var i = 0; i < cs.length; i++){
        cs[i].getDisplay().r /= 2;
      }
      for (var i = 0; i < es.length; i++){
        es[i].getDisplay().stroke_width = "40";
      }
      d3.selectAll(".heroe_node").attr("r", function(d){ return d.getDisplay().r;});
      d3.selectAll(".comic_node").attr("r", function(d){ return d.getDisplay().r;});
      d3.selectAll(".arc_node").attr("stroke-width", function(d){ return d.getDisplay().stroke_width;});
    }
    console.log("done");
}
