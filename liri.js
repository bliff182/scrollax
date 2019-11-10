// GLOBAL VARIABLES
// ======================================================================================================

require('dotenv').config();

var keys = require('./keys.js');
var axios = require('axios');
var Spotify = require('node-spotify-api');
var moment = require('moment');

var spotify = new Spotify(keys.spotify);


function bandsInTown() {

    var artist = process.argv.slice(3).join('+');

    axios.get('https://rest.bandsintown.com/artists/' + artist + '/events?app_id=codingbootcamp')
        .then(function (response) {
            var eventInfo = response.data;
            // console.log(eventInfo);

            for (var i = 0; i < eventInfo.length; i++) {
                var date = moment(eventInfo[i].datetime).format('MM/DD/YYYY');
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


// bandsInTown();