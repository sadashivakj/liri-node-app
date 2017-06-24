var twitterkeys = require("./keys.js"); //import keys.js
var request = require("request"); //reference to imported request API  
var Twitter = require('twitter'); //reference to imported twitter API
var Spotify = require('node-spotify-api'); //reference to imported spotify API
var fs = require("fs"); //import fs API 

//store the twitterkeys data to the twitter array object 
var twitterKeyList = twitterkeys.twitterKeys;

//read the user entry from CLI.
//Entry can either be - 
//"my-tweets" OR "spotify-this-song" 
//OR "movie-this" OR "do-what-it-says"
//var userEntry = Number(process.argv[3]);

//using switch operator call respective functions 
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

/**
* showSong() function will read the argument from CLI
* grab the songName user has entered
* if the songName is blank, hard code "The Sign" as the song name.
* call getSongFromSpotify() and pass the song name as the parameter
*/
function showSong(){

	var songName = "";
	var nodeArgs = process.argv;
	
	//go over the CLI parameters starting from second index 
	//to grab the song name entered by the user
	for (var i = 3; i < nodeArgs.length; i++) {
		if (i > 3 && i < nodeArgs.length) {
	   		songName = songName + "+" + nodeArgs[i];
	  	} else {
	    	songName += nodeArgs[i];
	  	}
	}

	//if song name is not entered by the user, default the song name
	if(songName === ""){
		songName = "The Sign";
	}

	//call Spotify API and display the data to console
	getSongFromSpotify(songName);
}

/**
* getSongFromSpotify() function will take the song name as parameter
* call spotify API and get the data based on the song name entered
*/
function getSongFromSpotify(songName){

	var client_id = '8c12bc40179846a4a53ddf451f63f33b';
	var client_secret = '3286fe96834e4eb39ef17d29f250ecfc';

	var spotify = new Spotify({
  		id: client_id,
  		secret: client_secret
	});
 
 	//Call search() function in spotify API
 	// pass songName and limit the record to 1 for retrieving
 	// display Artist name, song name, URL for the song and name of the album
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

/**
* doWhatItSays() function will read from random.txt file
* split the content of the file based on the delimiter ","  
* grab the name of the song and call getSongFromSpotify() by passing song name
*/
function doWhatItSays(){

	var readSongName = "";

	fs.readFile("random.txt", "utf8", function(error,data){
		if (error) {
		    return console.log(error);
		}
		var dataArr = data.split(",");
		readSongName = dataArr[1];
		getSongFromSpotify(readSongName);
	});
}

/**
* showTweets() function will take data from twitterkeyList object and  
* initialize the Twitter constructor and call get() function to get the tweets
*/
function showTweets(){
	//inialize the twitter object by calling in the constructor and pass keys
	var client = new Twitter({
		consumer_key: twitterKeyList.consumer_key,
	  	consumer_secret: twitterKeyList.consumer_secret,
	  	access_token_key: twitterKeyList.access_token_key,
	  	access_token_secret: twitterKeyList.access_token_secret
	});
	
	//pass your screen_name and retrieve only 20 latest tweets 
	var params = {screen_name: 'kj_ut', count: 20};
	//call get() function and get latest 20 tweets
	client.get('statuses/user_timeline', params, function(error, tweets, response){  
	  if (!error) {
	    console.log(tweets);
	  }
	});
}

/**
* showMovie() function call build the query string to call OMDB API 
* and pass movie name to retrieve the movie data
*/
function showMovie(){
	var movieName = "";
	var nodeArgs = process.argv;

	//read the CLI parameters and take the second parameter which is movie name  
	for (var i = 3; i < nodeArgs.length; i++) {
		if (i > 3 && i < nodeArgs.length) {
	   		movieName = movieName + "+" + nodeArgs[i];
	   	} else {
	    	movieName += nodeArgs[i];
	    }
	}
	
	//if movie name is not passed then default it "Mr.Nobody"
	if(movieName === ""){
		movieName = "Mr.Nobody";
	}

	// Then run a request to the OMDB API with the movie specified
	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + 
									"&y=&plot=short&apikey=40e9cece";

	// This will console out all the data from the response
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