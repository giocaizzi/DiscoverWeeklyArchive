import { getRequest as get } from "../../helpers/requestHelpers.js";


// user info
export function getUserInfo(accessToken) {
  return get(
    'https://api.spotify.com/v1/me',
    accessToken
  );
}

// user playlists
export function getUserPlaylists(accessToken) {
  return get(
    'https://api.spotify.com/v1/me/playlists',
    accessToken
  );
}

// user specific playlist
export function getPlaylist(accessToken, playlistId) {
  return get(
    `https://api.spotify.com/v1/playlists/${playlistId}`,
    accessToken
  );
}
