/* global request */

var GetData = function() {
	var that = {};
	
	const API_URL = "https://gateway.marvel.com:443/v1/public/characters?name={{name}}&apikey=248c9135996ac41e7aacd4ff9235ec79";

	function getDataForProfile(clickedName) {
		var options = {url: API_URL.replace("{{name}}", clickedName),
					  success: function (data) {
					  	var answer = JSON.parse(data);
					  	fillProfile(answer);
					  }};
		request.get(options);
	}

	function fillProfile(answer) {
		console.log(answer);
	}

	that.getDataForProfile = getDataForProfile;
	that.fillProfile = fillProfile;
	return that;
}