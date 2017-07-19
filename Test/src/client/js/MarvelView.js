MarvelApp.MarvelView = function(){
 "use strict"

 var that = {},

 eventKeys,

 handleMouseEvent,
 handleClick,

 //dom
 svg,
 events_g,
 lines_g,
 lines_active_g,
 characters_g,
 characters_active_g,
 comics_g,
 hero_description,
 description_image,
 description_name,
 description_description,
 description_link,
 description_dataInfoName_1,
 description_dataInfoValue_1,
 description_dataInfoName_2,
 description_dataInfoValue_2;

 function init(dom, keys){
   svg = d3.select(dom.svg);
   events_g = svg.select(dom.events);
   lines_g = svg.select(dom.lines);
   lines_active_g = svg.select(dom.lines_active);
   characters_g = svg.select(dom.characters);
   characters_active_g = svg.select(dom.characters_active);
   comics_g = svg.select(dom.comics);

   hero_description = document.getElementById(dom.hero_description_id);
   description_image = document.getElementById(dom.description_image_id);
   description_name = document.getElementById(dom.description_name_id);
   description_description = document.getElementById(dom.description_description_id);
   description_link = document.getElementById(dom.description_link);
   description_dataInfoName_1 = document.getElementById(dom.description_dataInfoName_1);
   description_dataInfoValue_1 = document.getElementById(dom.description_dataInfoValue_1);
   description_dataInfoName_2 = document.getElementById(dom.description_dataInfoName_2);
   description_dataInfoValue_2 = document.getElementById(dom.description_dataInfoValue_2);

   eventKeys = keys;
 }

 function setMouseEventHandlers(listeners){
   handleMouseEvent = listeners.onmousemoved;
   handleClick = listeners.onclick;
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
    .attr("class", "arc_node")
    .append('path')

    arc_node_selection_enter_g
    .append("g")
    .append("text");

    arc_node_selection = arc_node_selection_enter_g
    .merge(arc_node_selection);

    arc_node_selection
    .select('path')
    .attr('d', function(element){return element.d;})
    .attr('stroke', function(element){return element.color;})
    .attr("fill", "none")
    .attr("style", "cursor: pointer")
    .on("mouseover", eventMouseIn)
    .on("mouseout", eventMouseOut)
    .on("click", eventClick)
    .transition()
    .delay(10)
    .duration(500)
    .attr('stroke-width', function(element){return element.stroke_width;});

    arc_node_selection
    .select("g")
    .attr("transform", function(element) { return "translate(" + element.lableData.lablePos.x + "," + element.lableData.lablePos.y + ")"; })

    arc_node_selection
    .select("text")
    .attr("x", 0)
    .attr("y", 0)
    .attr("transform", function(element){ return "rotate(" + element.lableData.lableRot + ")";})
    .attr("text-anchor", function(element){ return element.lableData.textAnchor;})
    .attr("alignment-baseline", "middle")
    .text(function(element) { return element.lableData.name; });
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
    .attr("class", "line_node")
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
    .attr("class", "comic_node")
    .append('circle');

    comic_nodes_selection_enter_g
    .append("title");

    comic_nodes_selection = comic_nodes_selection_enter_g
    .merge(comic_nodes_selection);

    comic_nodes_selection
    .select("circle")
    .attr("cx", function(element) { return element.x; })
    .attr("cy", function(element) { return element.y; })
    .attr("style", function(element) { return "fill: " + element.color + ";cursor: pointer";})
    .on("mouseover", comicMouseIn)
    .on("mouseout", comicMouseOut)
    .on("click", comicClick)
    .transition()
    .delay(10)
    .duration(500)
    .attr("r", function(element) { return element.r; });

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
    .attr("style", function(element) { return "fill: " + element.color + ";cursor: pointer"+ ((allowPointerEvents) ? ";" : "; pointer-events: none;");})
    .attr('stroke', function(element){return element.stroke;})
    .attr("stroke-width", function(element) { return element.stroke_width; })
    .on("mouseover", mouseIn)
    .on("mouseout", mouseOut)
    .on("click", characterClick);

    characters_nodes_selection
    .select("title")
    .text(function(element) { return element.name; });
  }

  function characterMouseIn(d,i){
    handleMouseEvent(eventKeys.IN, eventKeys.CHARACTER, d.id);
  }

  function characterMouseOut(d,i){
    handleMouseEvent(eventKeys.OUT, eventKeys.CHARACTER, d.id);
  }

  function comicMouseIn(d,i){
    handleMouseEvent(eventKeys.IN, eventKeys.COMIC, d.id);
  }

  function comicMouseOut(d,i){
    handleMouseEvent(eventKeys.OUT, eventKeys.COMIC, d.id);
  }

  function eventMouseIn(d,i){
    handleMouseEvent(eventKeys.IN, eventKeys.EVENT, d.id);
  }

  function eventMouseOut(d,i){
    handleMouseEvent(eventKeys.OUT, eventKeys.EVENT, d.id);
  }

  function eventClick(d,i){
    handleClick(eventKeys.EVENT, d.id);
  }

  function comicClick(d,i){
    handleClick(eventKeys.COMIC, d.id);
  }

  function characterClick(d,i){
    handleClick(eventKeys.CHARACTER, d.id);
  }

  function showDetail(show, data){
    if(show){
      description_image.appendChild(data.thumbnail);
      description_name.innerHTML = data.name;
      description_link.href = data.url;
      description_dataInfoName_1.innerHTML = data.dataInfo[0].name;
      description_dataInfoValue_1.innerHTML = data.dataInfo[0].value;
      description_dataInfoName_2.innerHTML = data.dataInfo[1].name;
      description_dataInfoValue_2.innerHTML = data.dataInfo[1].value;
      if(data.description != null && data.description != ""){
        description_description.innerHTML = data.description.slice(0,300);
        if(data.description.length >= 300){
          description_description.innerHTML += "...";
        }
      } else {
        description_description.innerHTML = "Not available.";
      }
      hero_description.className = "container";
    } else {
      hero_description.className = "container hidden";
      description_image.innerHTML = "";
    }
  }


 that.init = init;
 that.renderData = renderData;
 that.setMouseEventHandlers = setMouseEventHandlers;
 that.showDetail = showDetail;

 return that;
}
