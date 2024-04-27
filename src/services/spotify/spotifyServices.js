import { getRequest as getRequest } from "../../helpers/requestHelpers.js";

// user info
export function getUserInfo(accessToken) {
  return getRequest("https://api.spotify.com/v1/me", accessToken);
}

// user playlists
export function getUserPlaylists(accessToken) {
  return getRequest("https://api.spotify.com/v1/me/playlists", accessToken);
}

// user specific playlist
export function getPlaylist(accessToken, playlistId) {
  return getRequest(
    `https://api.spotify.com/v1/playlists/${playlistId}`,
    accessToken,
  );
}
