const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");


// Remember to insert your credentials here
const clientId = "987969bc40ee4db1955e9552785b38dc",
clientSecret = "1665fc163e154f75950c5f069027f1ce";

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

hbs.registerPartials(__dirname + '/views/partials');

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

app.use("/", (req, res, next) => {
  //   console.log(req.url);
  next();
});

app.get("/", (req, res, next) => {
  console.log(req.url);
  res.render("home");
});

app.get("/artist", (req, res) => {
  spotifyApi.searchArtists(req.query.searchfield)
    .then(data => {
      const artists = { artists: data.body.artists.items };
      console.log("The received data from the API: ", data.body.artists.items);
      res.render("artists", artists);
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then (data => {
         const albums = { albums :data.body.items};
         res.render("albums", albums);
        console.log("Test", data.body.items)
    },
    function(err) {
      console.error(err);
    }
  );
});


app.get("/tracks/:albumId", (req, res, next) => {
    spotifyApi.getAlbumTracks(req.params.id)
    .then (data => {
        const tracks = { tracks :data.body.items}
        res.render("tracks", tracks)
          
        
        console.log("Artist albums tracks", data.body.items);
     
      },
      function(err) {
        console.error(err);
      }
    );
  });


app.listen(4000, () =>
  console.log("My Spotify project running on port 4000 🎧 🥁 🎸 🔊")
);
