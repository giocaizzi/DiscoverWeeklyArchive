import { getData } from "../../utils.js";

// user info
export async function getMe(accessToken) {
  let meData = await getData("https://api.spotify.com/v1/me", accessToken);
  return {
    "id": meData.id,
    "name": meData.display_name,
  };
}

// user tracks
export async function getTracks(accessToken) {
  return await getData("https://api.spotify.com/v1/me/tracks", accessToken);
}

// user playlists
export async function getPlaylists(accessToken) {
  // get the playlists data
  let playlistsData = await getData(
    "https://api.spotify.com/v1/me/playlists",
    accessToken
  );

  // extract needed data
  let playlists = [];

  playlistsData.items.forEach(
    (playlist) => {
      playlists.push({
        "id": playlist.id,
        "name": playlist.name,
        "total_tracks": playlist.tracks.total,
      });

    }
  );

  // return the playlists;
  return {
    total: playlistsData.total,
    "playlists": playlists
  };
}

// user specific playlist
export async function getPlaylist(accessToken, playlistId) {
  let playlistData = await getData(
    `https://api.spotify.com/v1/playlists/${playlistId}`,
    accessToken
  );
  return {
    "id": playlistData.id,
    "name": playlistData.name,
    "total_tracks": playlistData.tracks.total,
    "tracks" : playlistData.tracks.items.length,
  };
}
