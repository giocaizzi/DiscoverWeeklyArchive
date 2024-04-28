import querystring from "querystring";
import config from "../../config.js";
// services
import { generateRandomString, generateAuthUrl, getTokens } from "./service.js";

// https://developer.spotify.com/documentation/web-api/tutorials/code-flow

// login
export function login(req, res) {
  var state = generateRandomString(16);
  res.cookie(config.stateKey, state);
  res.redirect(generateAuthUrl(state));
}

// logout
export function logout(req, res) {
  // destroy session to logout
  req.session.destroy(
    // callback on session destroy
    function (err) {
      if (err) {
        // send error if logout unsuccessful
        res.json({ message: "logout error", error: err });
      } else {
        // redirect to homepage if logout successful
        res.redirect("/");
      }
    },
  );
}

// refresh token when expired
export function refreshToken(req, res) {
  // TODO: test this
  var refresh_token = req.query.refresh_token;
  var isRenewal = true;
  try {
    const tokens = getTokens(refresh_token, isRenewal);
    // store tokens in session
    req.session.access_token = tokens.access_token;
    req.session.refresh_token = tokens.refresh_token;
    // redirect to homepage
    res.redirect("/");
  } catch (error) {
    // send error
    res.status(500).json({ message: "refresh error", error: error });
  }
}

// callback
export async function callback(req, res) {
  // application requests refresh and access tokens
  // after checking the state parameter
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[config.stateKey] : null;

  /// check the state
  if (state === null || state !== storedState) {
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        }),
    );
  } else {
    // else it's a valid stare
    // clear cookie
    res.clearCookie(config.stateKey);
    try {
      // get tokens
      const tokens = await getTokens(code);
      // store tokens in session
      req.session.access_token = tokens.access_token;
      req.session.refresh_token = tokens.refresh_token;
      // redirect to homepage
      res.redirect("/");
    } catch (error) {
      // send error
      res.status(500).json({ message: "login error", error: error.message });
    }
  }
}
