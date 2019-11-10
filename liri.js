// ======================================================================================================
// GLOBAL VARIABLES
// ======================================================================================================

require('dotenv').config();

var keys = require('./keys.js');
var fs = require('fs');
var axios = require('axios');
var Spotify = require('node-spotify-api');
var moment = require('moment');

var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var movie;

// ======================================================================================================
// FUNCTIONS
// ======================================================================================================

function bandsInTown() {

    var artist = process.argv.slice(3).join('+');

    axios.get('https://rest.bandsintown.com/artists/' + artist + '/events?app_id=codingbootcamp')
        .then(function (response) {
            var eventInfo = response.data;
            // console.log(eventInfo);

            for (var i = 0; i < eventInfo.length; i++) {
                var date = moment(eventInfo[i].datetime).format('MM/DD/YYYY');
                console.log('');
                console.log("---------------Event---------------");
                console.log('Venue: ' + eventInfo[i].venue.name);
                console.log('Location: ' + eventInfo[i].venue.city + ', ' + eventInfo[i].venue.country);
                console.log('Date: ' + date);
                console.log("-----------------------------------");
                console.log('');
            }
        }).catch(function (error) {
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
        })
}

function spotifySearch() {

    var song = process.argv.slice(3).join(' ');

    spotify.search({ type: 'track', query: song }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        var songInfo = data.tracks.items[0];
        console.log('');
        console.log('Artist: ' + songInfo.album.artists[0].name);
        console.log('Song: ' + songInfo.name);
        console.log('Preview Link: ' + songInfo.preview_url);
        console.log('Album: ' + songInfo.album.name);
        console.log('');

        // console.log(data.tracks.items); // everything
        // console.log(data.tracks.items[0].album.artists[0].name); // artist name
        // console.log(data.tracks.items[0].name); // song name
        // console.log(data.tracks.items[0].album.external_urls);
        // console.log(data.tracks.items[0].preview_url); // song preview link but a lot come back as null
        // console.log(data.tracks.items[0].album.name); // album name
    });
}

function movieSearch() {
    
    if (process.argv[3]) {
        movie = process.argv.slice(3).join('+');
        movieOutput();
    } 
    else {
        movie = 'mr+nobody';
        movieOutput();
    }
}

function movieOutput() {

    axios.get('http://www.omdbapi.com/?t=' + movie + '&y=&plot=short&apikey=trilogy')
        .then(function (response) {

            var movieInfo = response.data;

            // console.log(movieInfo); // everything
            console.log('')
            console.log('Movie title: ' + movieInfo.Title);
            console.log('Release year: ' + movieInfo.Year);
            console.log('IMDb rating: ' + movieInfo.imdbRating);
            console.log('Rotten Tomatoes score: ' + movieInfo.Ratings[1].Value);
            console.log('Country: ' + movieInfo.Country);
            console.log('Language: ' + movieInfo.Language);
            console.log(movieInfo.Plot);
            console.log('Starring: ' + movieInfo.Actors);
            console.log('');

        }).catch(function (error) {
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

// ======================================================================================================


// bandsInTown();

// spotifySearch();

movieSearch();