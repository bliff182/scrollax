# scrollax - LIRI

LIRI, standing for Language Interpretation and Recognition Interface, is a CLI app, intended for use with Node.js, that takes in user-input parameters and gives you back data. LIRI can currently search for concert, song, and movie information using the Bands In Town, Spotify, and OMDb APIs, respectively.

## How LIRI Works

The following terminal commands can be used with LIRI:

- `concert-this <artist/band name here>`: This will search the Bands In Town Artist Events API for an artist and return venue names, locations, and concert dates of the for the specified artist.

- `spotify-this-song <song name here>`: This will utilize the node-spotify-api package and return the artist, album, and Spotify preview link for the specified song. When this command is used with no user input, the information for "The Sign" by Ace of Base is returned.

- `movie-this <movie name here>`: This utilizes the OMDb API and returns the the title, release year, IMDb and Rotten Tomatoes ratings, production country, language, plot synopsis, and actors in the specified movie. When this command is used with no user input, the information for the movie **Mr. Nobody** is returned.

- `do-what-it-says`: This takes the command written in the `random.txt` file and runs it. This .txt file can be edited to run any of LIRI's commands.

## How to Use LIRI

1. Open your preferred terminal program.

2. Navigate to the folder containing the `liri.js` and `package.json` files.

3. Run `npm install` in your terminal to install the necessary dependencies.

4. Type `node liri.js` followed by any of the commands described above.

See the screenshots below for LIRI's functionality:

`node liri.js concert-this <artist/band name here>`
![concert-this](/screenshots/concert-this.png)

`node liri.js spotify-this-song (no user input)`
![spotify-this-song_no-input](/screenshots/spotify-this-song_no-input.png)

`node liri.js spotify-this-song <song name here>`
![spotify-this-song](/screenshots/spotify-this-song.png)

`node liri.js movie-this (no user input)`
![movie-this_no-input](/screenshots/movie-this_no-input.png)

`node liri.js movie-this <movie name here>`
![movie-this](/screenshots/movie-this.png)

`node liri.js do-what-it-says`
![do-what-it-says](/screenshots/do-what-it-says.png)

## Tools Used

- JavaScript
- Node.js
- [Bands In Town API](https://www.artists.bandsintown.com/login)
- [Node-Spotify-API](https://www.npmjs.com/package/node-spotify-api)
- [OMDb API](http://www.omdbapi.com)
- [Axios](https://www.npmjs.com/package/axios)
- [Moment](https://www.npmjs.com/package/moment)
- [DotEnv](https://www.npmjs.com/package/dotenv)

**Created by Mike Bither**
