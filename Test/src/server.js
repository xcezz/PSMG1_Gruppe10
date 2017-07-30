var marvel = require('marvel-api'),
marvelServerApp = require(__dirname + "/server/MarvelServerApp.js"),
myMarvelAPI = require(__dirname + "/server/MyMarvelAPI.js"),
marvelDataModel = require(__dirname + "/server/MarvelDataModel.js"),
fs = require('fs'),
express = require('express'),
app = express(),
dataForClients;

app.use(express.static(__dirname + '/client'));

app.get('/', function (req, res) {
   res.sendFile('index.html');
});

app.get('/data', function (req, res) {
   res.send(JSON.stringify(dataForClients));
});

// initialize marvelServerApp Module
try{
  marvelServerApp = marvelServerApp(marvel, myMarvelAPI, marvelDataModel)
  .init();

  // if last successfully loaded data older than 24 hours
  // -> load new
  // else use cached data
  fs.readFile(__dirname + '/tmp/last_date.txt', function(err, data){
    if(err) {
      return console.log(err);
    }
    if((new Date().getTime() - Number(data)) > 24 * 60 * 60 * 1000){
      getAvengerData();
    } else{
      dataFromFile();
    }
  });
} catch(e){
  console.log("Invalid API Keys.\nPlease enter your keys (https://developer.marvel.com/account)");
  dataFromFile();
}

//starting server
function dataReady(){
  console.log("Data ready!\nStarting server...");
  var server = app.listen(8081, function () {
     var host = server.address().address
     var port = server.address().port

     console.log("Marvel app listening at http://%s:%s", host, port)
  });
}

function getAvengerData(){
  console.log("Reloading Avenger data...");
  marvelServerApp.getAvengerData(
    getAvengerDataSucess,
    getAvengerDataFail
  );
}

// write data into tmp/data.json
// overwrite tmp/error.json with ""
// overwrite tmp/last_date.txt with current time in milliseconds
// call dataReady
function getAvengerDataSucess(data){
  fs.writeFile(__dirname + "/tmp/data.json", JSON.stringify(data), function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("Data fetched and processed successfully!");

    fs.writeFile(__dirname + "/tmp/errors.json", "", function(err) {
      if(err) {
          return console.log(err);
      }
    });

    fs.writeFile(__dirname + "/tmp/last_date.txt", new Date().getTime(), function(err) {
      if(err) {
          return console.log(err);
      }
      dataForClients = data
      dataReady();
    });
  });
}

// write occured errors into tmp/errors.json
// call dataFromFile
function getAvengerDataFail(errors){
  var errorJSON = {};
  for(var e in errors.errors){
    errorJSON[e] = {};
    for(var id in errors.errors[e]){
      errorJSON[e][id] = {
        code: errors.errors[e][id].code,
        message: errors.errors[e][id].message
      }
    }
  }
  fs.writeFile(__dirname + "/tmp/errors.json", JSON.stringify(errorJSON,null,"\t"), function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("Error(s) occured while fetching data.\nPlease look at tmp/errors.json for further information.");
    dataFromFile();
  });
}

// getting last successfully loaded avenger data
function dataFromFile(){
  console.log("Loading cached data from file...");
  fs.readFile(__dirname + '/tmp/data.json', function(err, data){
    if(err) {
      return console.log(err);
    }
    dataForClients = JSON.parse(data);
    dataReady();
  });
}
