import fetch from 'node-fetch';
import dotenv from 'dotenv';
import open from 'open';
import querystring from 'querystring';
import express from 'express';

// Spotify API credentials
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

// Spotify API endpoints
const apiBaseUrl = 'https://api.spotify.com/v1';
const tokenUrl = 'https://accounts.spotify.com/api/token';
const authUrl = 'https://accounts.spotify.com/authorize?';
const redirectUri = 'https://localhost:8888/callback';


// scopes for the token
const scope = 'user-read-private user-read-email';

// APP

const app = express();

app.get('/login', (req, res) => {
  res.redirect(authUrl +
    querystring.stringify({
      response_type: 'code',
      client_id: clientId,
      scope: scope,
      redirect_uri: redirectUri,
    }));
});

app.get('/callback', async (req, res) => {
  const code = req.query.code || null;

  const authOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + (new Buffer.from(clientId + ':' + clientSecret).toString('base64'))
    },
    body: querystring.stringify({
      code: code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    })
  };

  try {
    const response = await fetch(tokenUrl, authOptions);
    const data = await response.json();

    console.log(data); // Here's your access token and refresh token

    res.send('Success! You can close the window.');
  } catch (error) {
    console.error('Error:', error);
    res.send('Error! Check the console for more details.');
  }
});

app.listen(8888, () => {
  console.log('Server is running on port 8888');
  open('http://localhost:8888/login');
});