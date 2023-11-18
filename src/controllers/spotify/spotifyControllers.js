// services
import { getUserInfo, getUserPlaylists, getPlaylist } from '../../services/spotify/spotifyServices.js';

// user 
export function user(req, res) {
        getUserInfo(req.session.access_token)
            .then(
                // if successful send user info
                userInfo => res.status(200).json(userInfo))
            .catch(
                // else send error
                error => res.status(500).json(error));
}  

// playlists 

export function userPlaylists(req, res) {
    getUserPlaylists(req.session.access_token)
        .then(
            // if successful send user playlists
            userPlaylists => res.status(200).json(userPlaylists))
        .catch(
            // else send error
            error => res.status(500).json(error));
}

// playlist 

export function playlist(req, res) {
    getPlaylist(req.session.access_token, req.params.playlistId)
        .then(
            // if successful send playlist info
            playlistInfo => res.status(200).json(playlistInfo))
        .catch(
            // else send error
            error => res.status(500).json(error));
}