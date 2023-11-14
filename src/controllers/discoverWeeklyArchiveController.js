import {discoverWeeklyArchive} from '../services/discoverWeeklyArchiveService.js';

export function discoverWeeklyArchiveController (req, res) {
    discoverWeeklyArchive(req.params.playlistId)
}