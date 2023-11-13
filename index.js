const fetch = require('node-fetch'); // Assuming you are running this in a Node.js environment

// Your Spotify API credentials
const clientId = 'YOUR_CLIENT_ID';
const clientSecret = 'YOUR_CLIENT_SECRET';

// Spotify API endpoints
const apiBaseUrl = 'https://api.spotify.com/v1';
const authUrl = 'https://accounts.spotify.com/api/token';

// Example playlists
const playlist1Id = 'PLAYLIST_1_ID';
const playlist2Id = 'PLAYLIST_2_ID';

// Function to get access token
async function getAccessToken() {
    const response = await fetch(authUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
        },
        body: 'grant_type=client_credentials',
    });

    const data = await response.json();
    return data.access_token;
}

// Function to get playlist tracks
async function getPlaylistTracks(accessToken, playlistId) {
    const response = await fetch(`${apiBaseUrl}/playlists/${playlistId}/tracks`, {
        headers: {
            'Authorization': 'Bearer ' + accessToken,
        },
    });

    const data = await response.json();
    return data.items.map(item => item.track.name);
}

// Function to compare playlists
async function comparePlaylists() {
    try {
        // Get access tokens
        const accessToken = await getAccessToken();

        // Get playlist tracks
        const playlist1Tracks = await getPlaylistTracks(accessToken, playlist1Id);
        const playlist2Tracks = await getPlaylistTracks(accessToken, playlist2Id);

        // Compare playlists and remove duplicates
        playlist2Tracks.forEach(song => {
            const index = playlist1Tracks.indexOf(song);
            if (index !== -1) {
                playlist1Tracks.splice(index, 1);
            }
        });

        // Display the updated playlist1
        console.log("Updated Playlist 1:", playlist1Tracks);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Call the function to compare playlists
comparePlaylists();
