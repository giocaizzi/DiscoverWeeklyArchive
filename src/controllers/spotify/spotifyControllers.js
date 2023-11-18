// helper for get request
import { getRequestController } from '../../helpers/requestHelpers.js';

// services
import { getUserInfo, getUserPlaylists, getPlaylist } from '../../services/spotify/spotifyServices.js';

// user 
export const user = getRequestController(getUserInfo);

// playlists 
export const userPlaylists = getRequestController(getUserPlaylists);

// playlist
export const playlist = getRequestController(getPlaylist);