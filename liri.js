var twitterkeys = require("./keys.js"); //import keys.js
var request = require("request"); //reference to imported request API  
var Twitter = require('twitter'); //reference to imported twitter API
var Spotify = require('node-spotify-api'); //reference to imported spotify API
var fs = require("fs"); //import fs API 


var twitterKeyList = twitterkeys.twitterKeys;

console.log(twitterKeyList);

var userEntry = Number(process.argv[3]);

switch (process.argv[2]) {
    case "my-tweets":
        console.log(showTweets());
        break;

    case "spotify-this-song":
        console.log(showSong());
        break;

    case "movie-this":
        showMovie();
        break;

    case "do-what-it-says":
        console.log(doWhatItSays());
        break;
}

function showSong(){

	var songName = "";
	var nodeArgs = process.argv;
	
	for (var i = 3; i < nodeArgs.length; i++) {
		console.log("nodeArgs.length "+nodeArgs.length);
		if (i > 3 && i < nodeArgs.length) {
	   		songName = songName + "+" + nodeArgs[i];
	   		console.log("songName in if condition"+songName);
	  	} else {
	    	songName += nodeArgs[i];
	    	console.log("songName in else condition"+songName);
	  	}
	}
	console.log("songName outside for loop "+songName);
	if(songName === ""){
		songName = "The Sign";
	}

	getSongFromSpotify(songName);

}

function getSongFromSpotify(songName){

	var client_id = '8c12bc40179846a4a53ddf451f63f33b';
	var client_secret = '3286fe96834e4eb39ef17d29f250ecfc';

	var spotify = new Spotify({
  		id: client_id,
  		secret: client_secret
	});
 
	spotify.search({ type: 'track', query: songName, limit : 1 }, 
										function(err, data) {
  		if (err) {
    		return console.log('Error occurred: ' + err);
  		}
  		 console.log("~~~~~~~~~~~~ SONG INFORMATION ~~~~~~~~~~~~" + 
            "\n* ARTIST(S): " + data.tracks.items[0].artists[0].name +
            "\n* SONG: " + data.tracks.items[0].name + 
            "\n* PREVIEW LINK: " + data.tracks.items[0].preview_url +
            "\n* ALBUM: " + data.tracks.items[0].album.name);
 	});
}

function doWhatItSays(){

	var readSongName = "";

	fs.readFile("random.txt", "utf8", function(error,data){
		console.log("inside readFile function");
		if (error) {
		    return console.log(error);
		}
		console.log("data "+data);
		var dataArr = data.split(",");
		console.log("dataArr songName "+dataArr[1]);
		readSongName = dataArr[1];
		console.log("readSongName - "+readSongName);
		getSongFromSpotify(readSongName);
	});
}

function showTweets(){
	var client = new Twitter({
		consumer_key: twitterKeyList.consumer_key,
	  	consumer_secret: twitterKeyList.consumer_secret,
	  	access_token_key: twitterKeyList.access_token_key,
	  	access_token_secret: twitterKeyList.access_token_secret
	});
	 
	var params = {screen_name: 'kj_ut', count: 20};
	client.get('statuses/user_timeline', params, function(error, tweets, response){  
	  if (!error) {
	    console.log(tweets);
	  }
	});
}

function showMovie(){

	console.log("Inside showMovie function");
	var movieName = "";
	var nodeArgs = process.argv;

	for (var i = 3; i < nodeArgs.length; i++) {
		console.log("nodeArgs.length "+nodeArgs.length);
		if (i > 3 && i < nodeArgs.length) {
	   		movieName = movieName + "+" + nodeArgs[i];
	   		console.log("movieName in if condition"+movieName);
	  	} else {
	    	movieName += nodeArgs[i];
	    	console.log("movieName in else condition"+movieName);
	  	}
	}
	console.log("movieName outside for loop "+movieName);
	if(movieName === ""){
		movieName = "Mr.Nobody";
	}

	// Then run a request to the OMDB API with the movie specified
	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + 
									"&y=&plot=short&apikey=40e9cece";

	// This line is just to help us debug against the actual URL.
	console.log("Query URL - "+queryUrl);

	request(queryUrl, function(error, response, body){
		if(!error && response.statusCode === 200){
			console.log("Title Of the movie - "+JSON.parse(body).Title);
  			console.log("Year the movie came out - "+JSON.parse(body).Year);
  			console.log("IMDB Rating of the movie - "+JSON.parse(body).imdbRating);
			console.log("Country where the movie was produced - "+JSON.parse(body).Country);
			console.log("Language of the movie - "+JSON.parse(body).Language);
			console.log("Plot of the movie - "+JSON.parse(body).Plot);
			console.log("Actors in the movie - "+JSON.parse(body).Actors);
			console.log("Rotten Tomatoes URL - https://www.rottentomatoes.com/search/?search="+JSON.parse(body).Title);
		}
	});
}
