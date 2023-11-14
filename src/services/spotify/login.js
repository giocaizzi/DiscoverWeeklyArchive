import request from 'request';
import config from '../../config.js';

export function getTokens(code) {
  return new Promise((resolve, reject) => {
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