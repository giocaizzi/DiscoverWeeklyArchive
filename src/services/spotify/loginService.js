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
  const fetchArgs = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Basic " +
        new Buffer.from(config.client_id + ":" + config.client_secret).toString(
          "base64"
        ),
    },
    body: {
      grant_type: isRenewal ? "refresh_token" : "authorization_code",
      code: isRenewal ? null : code,
      refresh_token: isRenewal ? refresh_token : null,
      redirect_uri: config.redirect_uri,
    },
  };
  // POST request to get tokens
  const response = fetch(fetchArgs.url, {
    method: "POST",
    headers: fetchArgs.headers,
    body: JSON.stringify(fetchArgs.body),
  });
  if (response.ok) {
      // if response is ok, return json
    return response.json();
  } else {
    // else throw error
    throw new Error("Error getting tokens");
  }
}
