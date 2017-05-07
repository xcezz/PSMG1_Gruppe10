// based on: https://bost.ocks.org/mike/bar/
(function () {
    
function dataRecieved(data){
	console.log(data);									//Daten anzeigen
	//createElements(data);
	//createBubbleData(data);
}

function doChart() {
    "use strict";
    // hier eigenen Code einfügen!
    d3.csv('../data/data_marvel_api.csv', dataRecieved); //Daten einlesen
};
 
doChart();
})();
