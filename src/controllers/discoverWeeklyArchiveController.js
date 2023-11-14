import {discoverWeeklyArchive} from '../services/discoverWeeklyArchiveService.js';

export function discoverWeeklyArchiveController (req, res) {
    discoverWeeklyArchive(req.params.playlistId).then(
        // if successful send user info
        runInfo => res.status(200).json(runInfo)).catch(
        // else send error
        err => res.status(500).send(err)
        );
}