import request from 'request';
import config from '../../config.js';

export function getTokens(code, isRenewal = false, refresh_token = null) {
  return new Promise((resolve, reject) => {
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + (new Buffer.from(config.client_id + ':' + config.client_secret).toString('base64'))
      },
      form: {
        grant_type: isRenewal ? 'refresh_token' : 'authorization_code',
        code: isRenewal ? null : code,
        refresh_token: isRenewal ? refresh_token : null,
        redirect_uri: config.redirect_uri
      },
      json: true
    };

    request.post(authOptions, function (error, response, body) {
      if (error) {
        reject(error);
      } else if (response.statusCode !== 200) {
        reject(new Error(`Received status code ${response.statusCode}`));
      } else {
        resolve(body);
      }
    });
  });
}