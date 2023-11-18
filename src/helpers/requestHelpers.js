import request from 'request';

// Promise object is the eventual completion of failure of async
// one of three states: pending, fulfilled, or rejected

// resolve -> transition to pending to fulfilled
// reject -> transition to pending to rejected


export function getRequest(url, accessToken, items = []) {
  return new Promise((resolve, reject) => {
    var options = {
      url: url,
      headers: { 'Authorization': 'Bearer ' + accessToken },
      json: true
    };

    request.get(options, function (error, response, body) {
      if (error) {
        console.log("Request error: " + url)
        console.log(error);
        reject(response);
      } else {
        console.log("Request successful: " + url)
        resolve(body);
      }
    });
  });
}

export function getRequestController(serviceFunction) {
  return function (req, res) {
    // if the service function requires more than just the access token
    // then add the other params to the args array
    const args = [req.session.access_token];
    if (req.params) {
      for (let param in req.params) {
        args.push(req.params[param]);
      }
    }
    serviceFunction(...args)
      .then(
        // if successful send user info
        response => res.status(200).json(response))
      .catch(
        // else send error
        error => res.status(500).json({ "Message": "Error 500", "Error": error }));
  }
}