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
var song;
var songInfo;

// ======================================================================================================
// FUNCTIONS
// ======================================================================================================

function bandsInTown() {

    var artist = process.argv.slice(3).join('+');

    axios.get('https://rest.bandsintown.com/artists/' + artist + '/events?app_id=codingbootcamp')
        .then(function (response) {

            var eventInfo = response.data;

            for (var i = 0; i < eventInfo.length; i++) {
                var date = moment(eventInfo[i].datetime).format('MM/DD/YYYY');
                console.log('');
                console.log('---------------Event---------------');
                console.log('Venue: ' + eventInfo[i].venue.name);
                console.log('Location: ' + eventInfo[i].venue.city + ', ' + eventInfo[i].venue.country);
                console.log('Date: ' + date);
                console.log('-----------------------------------');
                console.log('');
            }
        }).catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log('---------------Data---------------');
                console.log(error.response.data);
                console.log('---------------Status---------------');
                console.log(error.response.status);
                console.log('---------------Status---------------');
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log(error.config);
        })
}

function spotifySearch() {

    if (process.argv[3]) {
        song = process.argv.slice(3).join(' ');
        spotifyResults();
    }
    else { // if no song is provided
        song = 'the sign';
        spotifyResults();
    }
}

function spotifyResults() {

    spotify.search({ type: 'track', query: song }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        if (song === 'the sign') {
            songInfo = data.tracks.items[5];
            spotifyLog();
        }
        else {
            songInfo = data.tracks.items[0];
            spotifyLog();
        }
    });
}

function spotifyLog() {
    console.log('');
    console.log('-----------------------------------');
    console.log('Artist: ' + songInfo.album.artists[0].name);
    console.log('Song: ' + songInfo.name);
    console.log('Preview Link: ' + songInfo.preview_url);
    console.log('Album: ' + songInfo.album.name);
    console.log('-----------------------------------');
    console.log('');
}

function movieSearch() {

    if (process.argv[3]) {
        movie = process.argv.slice(3).join('+');
        movieOutput();
    }
    else { // if no movie is provided
        movie = 'mr+nobody';
        movieOutput();
    }
}

function movieOutput() {

    axios.get('http://www.omdbapi.com/?t=' + movie + '&y=&plot=short&apikey=trilogy')
        .then(function (response) {

            var movieInfo = response.data;

            console.log('')
            console.log('-----------------------------------');
            console.log('Movie title: ' + movieInfo.Title);
            console.log('Release year: ' + movieInfo.Year);
            console.log('IMDb rating: ' + movieInfo.imdbRating);
            console.log('Rotten Tomatoes score: ' + movieInfo.Ratings[1].Value);
            console.log('Country: ' + movieInfo.Country);
            console.log('Language: ' + movieInfo.Language);
            console.log('Synopsis: ' + movieInfo.Plot);
            console.log('Starring: ' + movieInfo.Actors);
            console.log('-----------------------------------');
            console.log('');

        }).catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log('---------------Data---------------');
                console.log(error.response.data);
                console.log('---------------Status---------------');
                console.log(error.response.status);
                console.log('---------------Status---------------');
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log(error.config);
        });
}

// ======================================================================================================
// FUNCTION EXECUTION
// ======================================================================================================

switch (command) {

    case 'concert-this':
        bandsInTown();
        break;

    case 'spotify-this-song':
        spotifySearch();
        break;

    case 'movie-this':
        movieSearch();
        break;

    // case 'do-what-it-says':
    //     // function here
    //     break;

    default:
        console.log('Please enter a valid command.');
}