import { discoverWeeklyArchive } from "./service.js";

export async function discoverWeeklyArchiveController(req, res) {
  // get the access token from the session
  const accessToken = req.session.access_token;
  // call the service function
  const result = await discoverWeeklyArchive(accessToken, req.params.playlistId);
  // return the response from the service
  res.status(200).json(result);
}
