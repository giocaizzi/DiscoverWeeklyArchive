import { getPlaylist } from "../../services/spotify/playlistService.js";  


// playlist controller

export function playlist(req, res) {
    getPlaylist(req.session.access_token, req.params.playlistId)
        .then(
            // if successful send playlist info
            playlistInfo => res.status(200).json(playlistInfo))
        .catch(
            // else send error
            error => res.status(500).json(error));
}