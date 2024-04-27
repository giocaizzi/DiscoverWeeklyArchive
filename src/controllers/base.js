export function getController(serviceFunction) {
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
        (response) => res.status(200).json(response),
      )
      .catch(
        // else send error
        (error) => res.status(500).json({ Message: "Error 500", Error: error }),
      );
  };
}
