import request from 'request';
import querystring from 'querystring';
import crypto from 'crypto';


// config
import config from '../config.js';
// services
import { getUserInfo } from '../services/spotify/userService.js';
import { getTokens } from '../services/spotify/loginService.js';

//utils
const generateRandomString = (length) => {
    return crypto
        .randomBytes(60)
        .toString('hex')
        .slice(0, length);
}




// homepage
export function homepage(req, res) {
    // if the user is logged in get user info
    if (req.session.access_token) {
        getUserInfo(req.session.access_token)
            .then(
                // if successful send user info
                userInfo => res.send(userInfo))
            .catch(
                // else send error
                error => res.status(500).send(error));
    } else {
        // else send login page text
        res.send('Login to use DiscoverWeeklyArchive!');
    }
}


// login
export function login(req, res) {
    // login with auth
    var state = generateRandomString(16);
    res.cookie(config.stateKey, state);

    // application requests authorization
    // by requesting to "authorize endpoint"
    // if request is successful, the user is redirected to the redirect_uri
    // with the authorization code

    var scope = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: config.client_id,
            scope: scope,
            redirect_uri: config.redirect_uri,
            state: state
        }));
}


// logout
export function logout(req, res) {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
}


// refresh token when expired
export function refreshToken(req, res) {
    var refresh_token = req.query.refresh_token;
    getTokens(refresh_token, isRenewal = true)
        .then(
            tokens => {
                req.session.access_token = tokens.access_token;
                req.session.refresh_token = tokens.refresh_token;
                res.redirect('/');
            })
        .catch(error => res.status(500).send(error));
}



// callback
export function callback(req, res) {
    // application requests refresh and access tokens
    // after checking the state parameter
    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[config.stateKey] : null;

    /// check the state
    if (state === null || state !== storedState) {
        // if there is a state mismatch, error
        res.redirect('/#' +
            // querystring.stringify converts object to string
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {
        // else it's a valid stare
        // clear cookie
        res.clearCookie(config.stateKey);
        // get tokens
        getTokens(code)
            .then(
                // if successful
                tokens => {
                    // store tokens in session
                    req.session.access_token = tokens.access_token;
                    req.session.refresh_token = tokens.refresh_token;
                    // redirect to homepage
                    res.redirect('/');
                })
            .catch(
                // else send error
                error => res.status(500).send(error));
    }
}