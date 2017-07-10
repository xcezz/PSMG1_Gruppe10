MarvelApp.MarvelView = function(){
 "use strict"

 var that = {},

 eventKeys,
 handleMouseEvent,

 //dom
 svg,
 events_g,
 lines_g,
 lines_active_g,
 characters_g,
 characters_active_g,
 comics_g;

 function init(dom, keys){
   svg = d3.select(dom.svg);
   events_g = svg.select(dom.events);
   lines_g = svg.select(dom.lines);
   lines_active_g = svg.select(dom.lines_active);
   characters_g = svg.select(dom.characters);
   characters_active_g = svg.select(dom.characters_active);
   comics_g = svg.select(dom.comics);

   eventKeys = keys;
 }

 function setMouseEventHandler(listener){
   handleMouseEvent = listener;
 }

 function renderData(data){
   renderEvents(data.events);
   renderLines(lines_g, data.lines);
   renderLines(lines_active_g, data.lines_active);
   renderComics(data.comics);
   renderCharacters(characters_g, data.characters, characterMouseIn, characterMouseOut, true);
   renderCharacters(characters_active_g, data.characters_active, undefined, undefined, false);
 }


  function renderEvents(events){
    let arc_node_selection = events_g
    .selectAll(".arc_node")
    .data(events);

    arc_node_selection
    .exit()
    .remove();

    let arc_node_selection_enter_g = arc_node_selection
    .enter()
    .append("g");

    arc_node_selection_enter_g
    .attr("class", function(element) { return "arc_node"; })
    .append('path')

    arc_node_selection_enter_g
    .append("title");

    arc_node_selection = arc_node_selection_enter_g
    .merge(arc_node_selection);

    arc_node_selection
    .select('path')
    .attr('d', function(element){return element.d;})
    .attr('stroke', function(element){return element.color;})
    .attr('stroke-width', function(element){return element.stroke_width;})
    .attr("fill", function(element) { return "none"; })
    .on("mouseover", eventMouseIn)
    .on("mouseout", eventMouseOut);

    arc_node_selection
    .select("title")
    .text(function(element) { return element.name + "\n" + element.count; });
  }

  function renderLines(parent, lines){
    let line_nodes_selection = parent
    .selectAll(".line_node")
    .data(lines);

    line_nodes_selection
    .exit()
    .remove();

    let line_nodes_selection_enter_g = line_nodes_selection
    .enter()
    .append("g");

    line_nodes_selection_enter_g
    .attr("class", function(element) { return "line_node"; })
    .append("path");

    line_nodes_selection = line_nodes_selection_enter_g
    .merge(line_nodes_selection);

    line_nodes_selection
    .select("path")
    .attr('d', function(element){return "M" + element.x_start + " " + element.y_start + " L " + element.x_end + " " + element.y_end;})
    .attr('stroke', function(element){return element.color;})
    .attr('style', "pointer-events: none;")
    .attr('stroke-width', function(element){return element.stroke_width;});
  }

  function renderComics(comics){
    let comic_nodes_selection = comics_g
    .selectAll(".comic_node")
    .data(comics);

    comic_nodes_selection
    .exit()
    .remove();

    let comic_nodes_selection_enter_g = comic_nodes_selection
    .enter()
    .append("g");

    comic_nodes_selection_enter_g
    .attr("class", function(element) { return "comic_node"; })
    .append('circle');

    comic_nodes_selection_enter_g
    .append("title");

    comic_nodes_selection = comic_nodes_selection_enter_g
    .merge(comic_nodes_selection);

    comic_nodes_selection
    .select("circle")
    .attr("r", function(element) { return element.r; })
    .attr("cx", function(element) { return element.x; })
    .attr("cy", function(element) { return element.y; })
    .attr("style", function(element) { return "fill: " + element.color; })
    .on("mouseover", comicMouseIn)
    .on("mouseout", comicMouseOut);

    comic_nodes_selection
    .select("title")
    .text(function(element) { return element.name });
  }

  function renderCharacters(parent, characters, mouseIn, mouseOut, allowPointerEvents){
    var characters_nodes_selection = parent
    .selectAll(".heroe_node")
    .data(characters);

    characters_nodes_selection
    .exit()
    .remove();

    let characters_nodes_selection_enter_g = characters_nodes_selection
    .enter()
    .append("g");

    characters_nodes_selection_enter_g
    .attr("class", function(element) { return "heroe_node"; })
    .append('circle');

    characters_nodes_selection_enter_g
    .append("title");

    characters_nodes_selection = characters_nodes_selection_enter_g
    .merge(characters_nodes_selection);

    characters_nodes_selection
    .select("circle")
    .attr("r", function(element) { return element.r; })
    .attr("cx", function(element) { return element.x; })
    .attr("cy", function(element) { return element.y; })
    .attr("style", function(element) { return "fill: " + element.color + ((allowPointerEvents) ? ";" : "; pointer-events: none;");})
    .attr('stroke', function(element){return element.stroke;})
    .attr("stroke-width", function(element) { return element.stroke_width; })
    .on("mouseover", mouseIn)
    .on("mouseout", mouseOut);

    characters_nodes_selection
    .select("title")
    .text(function(element) { return element.name + "\n" + element.count; });
  }

  function characterMouseIn(d,i){
    handleMouseEvent(eventKeys.IN, eventKeys.CHARACTER, d.name);
  }

  function characterMouseOut(d,i){
    handleMouseEvent(eventKeys.OUT, eventKeys.CHARACTER, d.name);
  }

  function comicMouseIn(d,i){
    handleMouseEvent(eventKeys.IN, eventKeys.COMIC, d.id);
  }

  function comicMouseOut(d,i){
    handleMouseEvent(eventKeys.OUT, eventKeys.COMIC, d.id);
  }

  function eventMouseIn(d,i){
    handleMouseEvent(eventKeys.IN, eventKeys.EVENT, d.name);
  }

  function eventMouseOut(d,i){
    handleMouseEvent(eventKeys.OUT, eventKeys.EVENT, d.name);
  }


 that.init = init;
 that.renderData = renderData;
 that.setMouseEventHandler = setMouseEventHandler;

 return that;
}
