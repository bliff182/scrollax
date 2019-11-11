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
var artist;
var song;
var songInfo;
var movie;

// ======================================================================================================
// FUNCTIONS
// ======================================================================================================

function concertThis() {

    artist = process.argv.slice(3).join('+');
    concertOutput();
}

function concertOutput() {

    axios.get('https://rest.bandsintown.com/artists/' + artist + '/events?app_id=codingbootcamp')
        .then(function (response) {

            var eventInfo = response.data;
            console.log('');
            // console.log(artist + ' Events:');

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
        });
}

function spotifyThisSong() {

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

function movieThis() {

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
                console.log('---------------Data---------------');
                console.log(error.response.data);
                console.log('---------------Status---------------');
                console.log(error.response.status);
                console.log('---------------Status---------------');
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log('Error', error.message);
            }
            console.log(error.config);
        });
}

function doWhatItSays() {

    fs.readFile('random.txt', 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }

        data = data.split(',');

        if (data[0] === 'concert-this') {
            artist = data[1].replace(/^"|"$/g, ''); // removes boudary quotes from data[1]
            // necessary because Bands In Town will not work if there are quotes around the artist
            concertOutput();
        }
        else if (data[0] === 'spotify-this-song') {
            song = data[1];
            spotifyResults();
        }
        else if (data[0] === 'movie-this') {
            movie = data[1];
            movieOutput();
        }
        else {
            console.log("Doesn't look like anything to me.");
        }
    });
}

// ======================================================================================================
// FUNCTION EXECUTION
// ======================================================================================================

switch (command) {

    case 'concert-this':
        concertThis();
        break;

    case 'spotify-this-song':
        spotifyThisSong();
        break;

    case 'movie-this':
        movieThis();
        break;

    case 'do-what-it-says':
        doWhatItSays();
        break;

    default:
        console.log('');
        console.log("You confused LIRI. It's okay, she's not the brightest.");
        console.log('Enter "concert-this <artist/band name here>" to look for concerts!');
        console.log('Enter "spotify-this-song <song name here>" to look up information on any song!');
        console.log('Enter "movie-this <movie name here>" to search for movies!');
        console.log('Or just enter "do-what-it-says" to just go with the flow of random.txt!');
        console.log('');
}