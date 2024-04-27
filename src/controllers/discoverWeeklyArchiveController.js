import { discoverWeeklyArchive } from "../services/discoverWeeklyArchiveService.js";

export function discoverWeeklyArchiveController(req, res) {
  res.json(discoverWeeklyArchive(req.params.playlistId));
}
