import express from 'express';
import request from 'request';
import crypto from 'crypto';
import querystring from 'querystring';

// config

import config from '../config.js';


const router = express.Router();


//utils
const generateRandomString = (length) => {
    return crypto
      .randomBytes(60)
      .toString('hex')
      .slice(0, length);
  }
  

// ROUTES

router.get('/', function (req, res) {
    // if logged, in get user info
    if (req.session.access_token) {
        // get user info
        var options = {
            url: 'https://api.spotify.com/v1/me',
            headers: { 'Authorization': 'Bearer ' + req.session.access_token },
            json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function (error, response, body) {
            res.send(body);
        });
    } else {
        // do nothing
        res.send('Login to use DiscoverWeeklyArchive!');
    }
});

router.get('/login', function (req, res) {
    // login with auth
    var state = generateRandomString(16);
    res.cookie(config.stateKey, state);

    // application requests authorization
    // by redirecting to authorize endpoint
    // if the request is accepted 
    // redirected to callback endpoint
    var scope = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: config.client_id,
            scope: scope,
            redirect_uri: config.redirect_uri,
            state: state
        }));
});

router.get('/callback', function (req, res) {
    // application requests refresh and access tokens
    // after checking the state parameter
    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[config.stateKey] : null;

    if (state === null || state !== storedState) {
        // state mismatch
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {
        // it's a valid stare
        res.clearCookie(config.stateKey);
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: config.redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                Authorization: 'Basic ' + (new Buffer.from(config.client_id + ':' + config.client_secret).toString('base64'))
            },
            json: true
        };

        request.post(authOptions, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                // Store the tokens safely here
                req.session.access_token = body.access_token;
                req.session.refresh_token = body.refresh_token;
                res.redirect("/");
            }
        });
    }
});

router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});

// refresh token when expired
router.get('/refresh_token', function (req, res) {

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

export default router;
