import querystring from 'querystring';

// config
import config from '../../config.js';
// services
import { generateRandomString, generateAuthUrl, getTokens } from '../../services/spotify/loginService.js';


// login
export function login(req, res) {
    // login with auth
    // application requests authorization
    // by requesting to "authorize endpoint"
    // if request is successful, the user is redirected to the redirect_uri
    // with the authorization code
    // random state is generated to prevent CSRF attacks (see API docs)
    var state = generateRandomString(16);
    res.cookie(config.stateKey, state);
    res.redirect(generateAuthUrl(state));
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
    // TODO: test this
    var refresh_token = req.query.refresh_token;
    var isRenewal = true;
    getTokens(refresh_token, isRenewal)
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