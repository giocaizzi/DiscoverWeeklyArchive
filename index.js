import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Your Spotify API credentials
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

// Spotify API endpoints
const apiBaseUrl = 'https://api.spotify.com/v1';
const authUrl = 'https://accounts.spotify.com/api/token';

// Example playlists
const playlist2Id = process.env.PLAYLIST_ID;

// Function to get access token
async function getAccessToken() {
    // Define your scopes
    const scopes = [
        'user-library-read',
        'playlist-read-private',
        //  'playlist-modify-private'
    ];

    // Convert scopes array to a space-separated string
    const scopesString = scopes.join(' ');

    const response = await fetch(authUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
        },
        body: `grant_type=client_credentials&scope=${encodeURIComponent(scopesString)}`,
    });

    const data = await response.json();
    return data.access_token;
}

// Function to make API requests
async function fetchFromSpotify(url, accessToken) {
    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': 'Bearer ' + accessToken,
            },

        });
        if (!response.ok) {
            console.log(response);
            throw new Error(`Spotify API request failed with status ${response.status}`);

        } else {
            const data = await response.json();
            return data;
        }


    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Function to get playlist tracks
async function getPlaylistTracks(accessToken, playlistId) {
    const data = await fetchFromSpotify(`${apiBaseUrl}/playlists/${playlistId}/tracks`, accessToken);
    return data.items.map(item => item.track.name);
}

// Function to get saved tracks
async function getSavedTracks(accessToken) {
    const data = await fetchFromSpotify(`${apiBaseUrl}/me/tracks`, accessToken);
    console.log(data);
    // return data.items.map(item => item.track.name);
}

// Function to compare playlists
async function comparePlaylists() {
    try {
        // Get access tokens
        const accessToken = await getAccessToken();
        console.log("Logged in!")

        // Get saved tracks and playlist tracks
        const savedTracks = await getSavedTracks(accessToken);
        // console.log(savedTracks[0])
        // // console.log("Number of saved tracks:", savedTracks.length);


        // const playlistTracks = await getPlaylistTracks(accessToken, playlist2Id);

        // // Compare saved tracks and playlist, and remove duplicates
        // const songsToDelete = [];
        // playlistTracks.forEach(playlistTrack => {
        //     const index = savedTracks.findIndex(savedTrack => savedTrack.name === playlistTrack.name);
        //     console.log("Looking for matches for track:", playlistTrack.name)
        //     if (index !== -1) {
        //         songsToDelete.push(savedTracks[index]);
        //         savedTracks.splice(index, 1);
        //     }
        // });
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Function to delete songs from a playlist
async function deleteSongs(accessToken, playlistId, songs) {
    const uris = songs.map(song => song.uri);
    const response = await fetch(`${apiBaseUrl}/playlists/${playlistId}/tracks`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uris }),
    });

    if (!response.ok) {
        throw new Error(`Failed to delete songs: ${response.statusText}`);
    }
}




// Call the function to compare playlists
comparePlaylists();
