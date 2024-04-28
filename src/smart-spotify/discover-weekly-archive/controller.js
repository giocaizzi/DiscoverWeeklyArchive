import { discoverWeeklyArchive } from "./service.js";

export function discoverWeeklyArchiveController(req, res) {
  // return the response from the service
  res.json(discoverWeeklyArchive(req.params.playlistId));
}
