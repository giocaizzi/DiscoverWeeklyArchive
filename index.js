/*
https://github.com/spotify/web-api-examples/blob/master/authorization/authorization_code/app.js
*/

import express from 'express';
import session from 'express-session';
import request from 'request';
import crypto from 'crypto';
import cors from 'cors';
import querystring from 'querystring';
import cookieParser from 'cookie-parser';

import dotenv from 'dotenv';

//load env variables
dotenv.config();
let client_id = process.env.CLIENT_ID;
let client_secret = process.env.CLIENT_SECRET;

// this is the URL that will be called upon successful authentication
// in app settings on https://developer.spotify.com/
const port = 8888;
var redirect_uri = 'http://localhost:' + port + '/callback';
var baseurl = "http://localhost:" + port + "/"


const generateRandomString = (length) => {
  return crypto
    .randomBytes(60)
    .toString('hex')
    .slice(0, length);
}



/// APP
var stateKey = 'spotify_auth_state';

var app = express();

app.use(cors())
  .use(cookieParser());

// session
app.use(session({
  secret: process.env.SESSION_SECRET,
  // other config
  resave: false, // don't save session if unmodified
  saveUninitialized: true, // don't create session until something stored
  cookie: { secire: false } // set tot true if https
}))

// ROUTES

app.get('/login', function (req, res) {
  // login with auth
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // application requests authorization
  // by redirecting to authorize endpoint
  // if the request is accepted 
  // redirected to callback endpoint
  var scope = 'user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', function (req, res) {
  // application requests refresh and access tokens
  // after checking the state parameter
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    // state mismatch
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    // it's a valid stare
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {

        req.session.access_token = body.access_token;
        req.session.refresh_token = body.refresh_token;
        // Store the tokens safely here

        res.send('Tokens retrieved successfully');
      }
    });
  }
});

//         var options = {
//           url: 'https://api.spotify.com/v1/me',
//           headers: { 'Authorization': 'Bearer ' + access_token },
//           json: true
//         };

//         // use the access token to access the Spotify Web API
//         request.get(options, function (error, response, body) {
//           console.log(body);
//         });

//         // we can also pass the token to the browser to make requests from there
//         res.redirect('/#' +
//           querystring.stringify({
//             access_token: access_token,
//             refresh_token: refresh_token
//           }));
//       } else {
//         res.redirect('/#' +
//           querystring.stringify({
//             error: 'invalid_token'
//           }));
//       }
//     });
//   }
// });

// refresh token when expired
app.get('/refresh_token', function (req, res) {

  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token,
        refresh_token = body.refresh_token;
      res.send({
        'access_token': access_token,
        'refresh_token': refresh_token
      });
    }
  });
});


// Main

console.log('Listening on 8888');
app.listen(8888);