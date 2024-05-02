import { getData, getPaginatedData } from "../../utils.js";

// user info
export async function getMe(accessToken) {
  let meData = await getData("https://api.spotify.com/v1/me", accessToken);
  return {
    id: meData.id,
    name: meData.display_name,
  };
}

// user tracks
export async function getTracks(accessToken) {
  // get the saved tracks data
  let savedTracksData = await getData(
    "https://api.spotify.com/v1/me/tracks",
    accessToken
  );

  // extract needed data
  let savedTracks = [];

  savedTracksData.items.forEach((track) => {
    savedTracks.push({
      id: track.track.id,
      name: track.track.name,
      artists: track.track.artists,
    });
  });

  return {
    total: savedTracksData.total,
    tracks: savedTracks,
  };
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

  playlistsData.items.forEach((playlist) => {
    playlists.push({
      id: playlist.id,
      name: playlist.name,
      total_tracks: playlist.tracks.total,
    });
  });

  // return the info on user playlists;
  return {
    total: playlistsData.total,
    playlists: playlists,
  };
}

// user specific playlist
export async function getPlaylist(accessToken, playlistId) {
  let playlistData = await getData(
    `https://api.spotify.com/v1/playlists/${playlistId}`,
    accessToken
  );
  // return info on the playlist
  return {
    id: playlistData.id,
    name: playlistData.name,
    total_tracks: playlistData.tracks.total,
    tracks: playlistData.tracks.items.length,
  };
}

export async function getPlaylistTracks(accessToken, playlistId) {
  // get playlist tracks data
  let playlistTracksData = await getData(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    accessToken
  );

  // extract needed data
  let playlistTracks = [];

  playlistTracksData.items.forEach((track) => {
    let artists = [];
    // get the artists for the track
    track.track.artists.forEach((artist) => {
      artists.push(artist.name);
    });
    // add the track to the playlist tracks array
    playlistTracks.push({
      id: track.track.id,
      name: track.track.name,
      artists: artists,
    });
  });

  // return the info on playlist tracks
  return {
    total: playlistTracksData.total,
    tracks: playlistTracks,
    tracks_count: playlistTracks.length,
  };
}
