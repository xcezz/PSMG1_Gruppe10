var api = require('marvel-api'),
fs = require('fs'),
comics = [],
offset = 0,
amount = 100,
comics_max = 1258,
todo = 0,
done = 0,
avenger_id = 1009165,
marvel = api.createClient({
  publicKey: 'publicKey',
  privateKey: 'privateKey'
});

function writeComics(){
  if(todo == done){
    comics.sort(function(a,b){
      return new Date(a.sale_date) - new Date(b.sale_date);
    });
    console.log(comics.length);
    fs.writeFile(__dirname + "/tmp/avengercomics.json", JSON.stringify(comics,null,"\t"), function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
  } else {
    console.log(done + "/" + todo + " " + new Date());
    setTimeout(function () {
      writeComics();
    }, 10000);
  }
}

function getAllComics(a,o){
  todo += 1;
  console.log(todo);
  marvel.characters.comics('1009165' /* id: "Avengers" */, a, o, function(err, results) {
    if (err) {
      return console.error(err);
    } else {
      var comic_list = results.data;
      for(var i = 0; i < comic_list.length; i++){
        var c = {};
        var item = comic_list[i];
        c.events = [];
        for(var j = 0; j < item.events.items.length; j++){
          c.events.push(item.events.items[j].name);
        }
        c.sale_date = item.dates[0].date;
        c.name = item.title;
        c.id = item.id;
        c.characters = [];
        getCharacters(c, item.characters);
        comics.push(c);
      }
      done += 1;
      console.log(done + "/" + todo);
    }
  });
}

function getCharacters(c, i){
  if(i.available === i.returned){
    c.characters = [];
    for(var j = 0; j < i.items.length; j++){
      c.characters.push(i.items[j].name);
    }
  }else{
    todo += 1;
    marvel.comics.characters(c.id , amount, 0, function(err, results) {
      if (err) {
        return console.error(err);
      } else {
        var characterdata = results.data;
        for(var i = 0; i < characterdata.length; i++){
          c.characters.push(characterdata[i].name);
        }
        done += 1;
        console.log(done + "/" + todo);
        if(results.meta.count < results.meta.total){
          console.log("missing characters: " + c.id);
        }
      }
    });
  }
}

for(var i = 0; i < comics_max / amount; i++){
  getAllComics(amount, offset);
  offset += amount;
}

writeComics();
