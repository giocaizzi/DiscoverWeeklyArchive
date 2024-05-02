import { getPlaylist } from "../../spotify/user/service.js";

export async function discoverWeeklyArchive(accessToken, playlistId) {
  // get the playlist
  let playlist = await getPlaylist(accessToken, playlistId);

  return {
    message: "Successfully executed DiscoverWeeklyArchive.",
    playlistId: playlistId,
    playlistTracks: playlist.tracks.items.length
  };
}
