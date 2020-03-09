// ======================================================================================================================================
// GLOBAL VARIABLES
// ======================================================================================================================================

require("dotenv").config();
var keys = require("./keys.js");
var fs = require("fs");
var axios = require("axios");
var Spotify = require("node-spotify-api");
var moment = require("moment");
var spotify = new Spotify(keys.spotify);
var command = process.argv[2];
var artist;
var song;
var songInfo;
var movie;

// ======================================================================================================================================
// FUNCTIONS
// ======================================================================================================================================

function concertThis() {
  artist = process.argv.slice(3).join("+");
  concertOutput();
  logCommand(artist);
}

function concertOutput() {
  axios
    .get(
      "https://rest.bandsintown.com/artists/" +
        artist +
        "/events?app_id=codingbootcamp"
    )
    .then(function(response) {
      var eventInfo = response.data;
      // console.log(artist + ' Events:');

      for (var i = 0; i < eventInfo.length; i++) {
        var venue = eventInfo[i].venue.name;
        var location =
          eventInfo[i].venue.city + ", " + eventInfo[i].venue.country;
        var date = moment(eventInfo[i].datetime).format("MM/DD/YYYY");

        console.log("");
        console.log("---------------Event---------------");
        console.log("Venue: " + venue);
        console.log("Location: " + location);
        console.log("Date: " + date);
        console.log("-----------------------------------");
        console.log("");

        fs.appendFile(
          "log.txt",
          "---------------Event---------------\nVenue: " +
            venue +
            "\nLocation: " +
            location +
            "\nDate: " +
            date +
            "\n-----------------------------------\n\n",
          function(err) {
            if (err) {
              console.log(err);
            }
          }
        );
      }
    })
    .catch(function(error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("---------------Data---------------");
        console.log(error.response.data);
        console.log("---------------Status---------------");
        console.log(error.response.status);
        console.log("---------------Status---------------");
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an object that comes back with details pertaining to the error that occurred.
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
}

function spotifyThisSong() {
  if (process.argv[3]) {
    song = process.argv.slice(3).join(" ");
  } else {
    // if no song is provided
    song = "ace of base the sign";
  }

  spotifyResults();
}

function spotifyResults() {
  logCommand(song);

  spotify.search({ type: "track", query: song }, function(err, data) {
    if (err) {
      return console.log("Error occurred: " + err);
    }

    songInfo = data.tracks.items[0];

    spotifyLog();
  });
}

function spotifyLog() {
  var artistName = songInfo.album.artists[0].name;
  var songName = songInfo.name;
  var preview = songInfo.preview_url;
  var album = songInfo.album.name;

  console.log("");
  console.log("-----------------------------------");
  console.log("Artist: " + artistName);
  console.log("Song: " + songName);
  console.log("Preview link: " + preview);
  console.log("Album: " + album);
  console.log("-----------------------------------");
  console.log("");

  fs.appendFile(
    "log.txt",
    "-----------------------------------\nArtist: " +
      artistName +
      "\nSong: " +
      songName +
      "\nPreview link: " +
      preview +
      "\nAlbum: " +
      album +
      "\n-----------------------------------\n\n",
    function(err) {
      if (err) {
        console.log(err);
      }
    }
  );
}

function movieThis() {
  if (process.argv[3]) {
    movie = process.argv.slice(3).join("+");
  } else {
    // if no movie is provided
    movie = "mr+nobody";
  }

  movieOutput();
}

function movieOutput() {
  logCommand(movie);

  axios
    .get("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy")
    .then(function(response) {
      var movieInfo = response.data;
      var title = movieInfo.Title;
      var year = movieInfo.Year;
      var imdb = movieInfo.imdbRating;
      var rt = movieInfo.Ratings[1].Value;
      var country = movieInfo.Country;
      var language = movieInfo.Language;
      var plot = movieInfo.Plot;
      var actors = movieInfo.Actors;

      console.log("");
      console.log("-----------------------------------");
      console.log("Movie title: " + title);
      console.log("Release year: " + year);
      console.log("IMDb rating: " + imdb);
      console.log("Rotten Tomatoes score: " + rt);
      console.log("Country: " + country);
      console.log("Language: " + language);
      console.log("Synopsis: " + plot);
      console.log("Starring: " + actors);
      console.log("-----------------------------------");
      console.log("");

      fs.appendFile(
        "log.txt",
        "-----------------------------------\nMovie title: " +
          title +
          "\nRelease year: " +
          year +
          "\nIMDb rating: " +
          imdb +
          "\nRotten Tomatoes score: " +
          rt +
          "\nCountry: " +
          country +
          "\nLanguage: " +
          language +
          "\nSynopsis: " +
          plot +
          "\nStarring: " +
          actors +
          "\n-----------------------------------\n\n",
        function(err) {
          if (err) {
            console.log();
          }
        }
      );
    })
    .catch(function(error) {
      if (error.response) {
        console.log("---------------Data---------------");
        console.log(error.response.data);
        console.log("---------------Status---------------");
        console.log(error.response.status);
        console.log("---------------Status---------------");
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
}

function doWhatItSays() {
  fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) {
      return console.log(err);
    }

    data = data.split(",");

    switch (data[0]) {
      case "concert-this":
        artist = data[1].replace(/^"|"$/g, ""); // removes boundary quotes from data[1]
        // necessary because Bands In Town will not work if there are quotes around the artist
        concertOutput();
        break;

      case "spotify-this-song":
        song = data[1];
        spotifyResults();
        break;

      case "movie-this":
        movie = data[1];
        movieOutput();
        break;

      default:
        console.log("Doesn't look like anything to me.");
    }
  });
}

function logCommand(text) {
  fs.appendFile(
    "log.txt",
    "-----------------------------------\nCommand entered: " +
      command +
      " " +
      text +
      "\n",
    function(err) {
      if (err) {
        console.log(err);
      }
    }
  );
}

// ======================================================================================================================================
// FUNCTION EXECUTION
// ======================================================================================================================================

switch (command) {
  case "concert-this":
    concertThis();
    break;

  case "spotify-this-song":
    spotifyThisSong();
    break;

  case "movie-this":
    movieThis();
    break;

  case "do-what-it-says":
    doWhatItSays();
    break;

  default:
    console.log("");
    console.log("You confused LIRI. It's okay, she's not the brightest.");
    console.log(
      'Enter "concert-this <artist/band name here>" to look for concerts!'
    );
    console.log(
      'Enter "spotify-this-song <song name here>" to look up information on any song!'
    );
    console.log('Enter "movie-this <movie name here>" to search for movies!');
    console.log(
      'Or just enter "do-what-it-says" to just go with the flow of random.txt!'
    );
    console.log("");
}
