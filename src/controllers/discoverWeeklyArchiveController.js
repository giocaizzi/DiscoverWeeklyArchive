import {discoverWeeklyArchive} from '../services/discoverWeeklyArchiveService.js';

export function discoverWeeklyArchiveController (req, res) {
    discoverWeeklyArchive(req.params.playlistId)
    res.send({
        "message": "DiscoverWeeklyArchive",
        "playlistId": req.params.playlistId,
    })
}