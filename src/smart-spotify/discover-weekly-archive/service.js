export function discoverWeeklyArchive(playlistId) {
  return {
    endpoint: "discoverWeeklyArchive",
    message: "Successfully executed DiscoverWeeklyArchive.",
    playlistId: playlistId,
  };
}
