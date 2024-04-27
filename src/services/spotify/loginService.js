import request from "request";
import querystring from "querystring";
import crypto from "crypto";

// config
import config from "../../config.js";

//utils
export const generateRandomString = (length) => {
  return crypto.randomBytes(60).toString("hex").slice(0, length);
};

export function generateAuthUrl(state) {
  var scope = "user-read-private playlist-read-private user-library-read";
  return (
    "https://accounts.spotify.com/authorize?" +
    querystring.stringify({
      response_type: "code",
      client_id: config.client_id,
      scope: scope,
      redirect_uri: config.redirect_uri,
      state: state,
    })
  );
}

//get tokens, either by authorization code or refresh token

export function getTokens(code, isRenewal = false, refresh_token = null) {
  return new Promise((resolve, reject) => {
    var authOptions = {
      url: "https://accounts.spotify.com/api/token",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          new Buffer.from(
            config.client_id + ":" + config.client_secret,
          ).toString("base64"),
      },
      form: {
        grant_type: isRenewal ? "refresh_token" : "authorization_code",
        code: isRenewal ? null : code,
        refresh_token: isRenewal ? refresh_token : null,
        redirect_uri: config.redirect_uri,
      },
      json: true,
    };

    request.post(authOptions, function (error, response, body) {
      if (error) {
        reject(response);
      } else {
        resolve(body);
      }
    });
  });
}
