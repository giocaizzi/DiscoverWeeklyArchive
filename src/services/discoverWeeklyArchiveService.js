
export function discoverWeeklyArchive(playlistId) {
    return new Promise((resolve, reject) => {
        if (playlistId) {
            resolve({
                'endpoint': 'discoverWeeklyArchive',
                "message": "Successfully executed DiscoverWeeklyArchive.",
                "playlistId": playlistId
            })
        } else {
            reject('Playlist ID is required.')
        }
    });
}