MarvelApp.MarvelView = function(){
 "use strict"

 var that = {},

 background_rendered,

 eventKeys,

 handleMouseEvent,
 handleClick,

 //dom
 svg,
 background_layer,
 active_layer,
 events_g,
 events_active_g,
 lines_g,
 lines_active_g,
 characters_g,
 characters_active_g,
 comics_g,
 comics_active_g,
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
   background_rendered = false;

   svg = d3.select(dom.svg);

   background_layer = svg.select(dom.background);
   active_layer = svg.select(dom.interactive);

   events_g = background_layer.select(dom.events);
   lines_g = background_layer.select(dom.lines);
   characters_g = background_layer.select(dom.characters);
   comics_g = background_layer.select(dom.comics);

   events_active_g = active_layer.select(dom.events);
   lines_active_g = active_layer.select(dom.lines);
   characters_active_g = active_layer.select(dom.characters);
   comics_active_g = active_layer.select(dom.comics);

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
   if(!background_rendered){
     renderEvents(events_g, data.all.events, true);
     renderLines(lines_g, data.all.lines);
     renderCharacters(characters_g, data.all.characters, true);
     renderComics(comics_g, data.all.comics, true);

     background_rendered = true;
   }

   renderEvents(events_active_g, data.active.events, false);
   renderLines(lines_active_g, data.active.lines);
   renderCharacters(characters_active_g, data.active.characters, false);
   renderComics(comics_active_g, data.active.comics, false);
 }


  function renderEvents(parent, data, allowPointerEvents){
    let arc_node_selection = parent
    .selectAll(".arc_node")
    .data(data);

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
    .attr('stroke-width', function(element){return element.stroke_width;});

    if(allowPointerEvents){
      arc_node_selection
      .select('path')
      .attr("style", "cursor: pointer")
      .on("mouseover", eventMouseIn)
      .on("mouseout", eventMouseOut)
      .on("click", eventClick);
    } else {
      arc_node_selection
      .select('path')
      .attr("style", "pointer-events: none")
    }

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
    .each(function(element,index,selectionArray) {
      var parentText = selectionArray[index];
      var strs = element.lableData.name.split(" ");
      var toreturn = "";
      parentText.textContent = "";
      var splits = 0;
      for(let str = 0; str < strs.length; str++){
        if((toreturn + strs[str]).length > 15){
          let tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
          tspan.textContent = toreturn;
          tspan.setAttribute("dx", 0);
          tspan.setAttribute("dy", 1.2 * splits + "em");
          tspan.setAttribute("text-anchor","middle");
          parentText.appendChild(tspan);
          toreturn = "";
          splits = 1;
        }
        toreturn += strs[str] + " ";
      }

      let tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
      tspan.textContent = toreturn;
      tspan.setAttribute("x", 0);
      tspan.setAttribute("dy", 1.2 * splits + "em");
      tspan.setAttribute("text-anchor","middle");
      parentText.appendChild(tspan);
    });
  }

  function renderLines(parent, data){
    let line_nodes_selection = parent
    .selectAll(".line_node")
    .data(data);

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

  function renderComics(parent, data, allowPointerEvents){
    let comic_nodes_selection = parent
    .selectAll(".comic_node")
    .data(data);

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
    .attr("r", function(element) { return element.r; });

    if(allowPointerEvents){
      comic_nodes_selection
      .select("circle")
      .attr("style", function(element) { return "fill: " + element.color + ";cursor: pointer";})
      .on("mouseover", comicMouseIn)
      .on("mouseout", comicMouseOut)
      .on("click", comicClick)
    } else {
      comic_nodes_selection
      .select("circle")
      .attr("style", function(element) { return "fill: " + element.color + ";pointer-events: none";});
    }

    comic_nodes_selection
    .select("title")
    .text(function(element) { return element.name });
  }

  function renderCharacters(parent, data, allowPointerEvents){
    var characters_nodes_selection = parent
    .selectAll(".heroe_node")
    .data(data);

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
    .attr('stroke', function(element){return element.stroke;})
    .attr("stroke-width", function(element) { return element.stroke_width; })

    if(allowPointerEvents){
      characters_nodes_selection
      .select("circle")
      .attr("style", function(element) { return "fill: " + element.color + ";cursor: pointer";})
      .on("mouseover", characterMouseIn)
      .on("mouseout", characterMouseOut)
      .on("click", characterClick);
    } else {
      characters_nodes_selection
      .select("circle")
      .attr("style", function(element) { return "fill: " + element.color + ";pointer-events: none";});
    }

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
