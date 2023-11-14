import request from 'request';

// Promise object is the eventual completion of failure of async
// one of three states: pending, fulfilled, or rejected

// resolve -> transition to pending to fulfilled
// reject -> transition to pending to rejected

export function getUserInfo(accessToken) {
  return new Promise((resolve, reject) => {
    var options = {
      url: 'https://api.spotify.com/v1/me',
      headers: { 'Authorization': 'Bearer ' + accessToken },
      json: true
    };

    request.get(options, function (error, response, body) {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
}