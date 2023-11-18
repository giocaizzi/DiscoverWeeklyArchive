import request from 'request';

// Promise object is the eventual completion of failure of async
// one of three states: pending, fulfilled, or rejected

// resolve -> transition to pending to fulfilled
// reject -> transition to pending to rejected


export function getRequest(url, accessToken) {
  return new Promise((resolve, reject) => {
    var options = {
      url: url,
      headers: { 'Authorization': 'Bearer ' + accessToken },
      json: true
    };

    request.get(options, function (error, response, body) {
      if (error) {
        reject(response);
      } else {
        resolve(body);
      }
    });
  });
}