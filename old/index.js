import fetch from "node-fetch";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Your Spotify API credentials
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

// Spotify API endpoints
const apiBaseUrl = "https://api.spotify.com/v1";
const authUrl = "https://accounts.spotify.com/api/token";

// Example playlists
const playlist2Id = process.env.PLAYLIST_ID;

// Function to get access token
async function getAccessToken() {
  // Define your scopes
  const scopes = [
    "user-library-read",
    // 'playlist-read-private',
    //  'playlist-modify-private'
  ];

  // Convert scopes array to a space-separated string
  const scopesString = scopes.join(" ");

  const response = await fetch(authUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(clientId + ":" + clientSecret).toString("base64"),
    },
    // body: `grant_type=client_credentials&scope=${encodeURIComponent(scopesString)}`,
    body: `grant_type=client_credentials&scope=user-library-read`,
  });

  const data = await response.json();
  return data.access_token;
}

// Function to make /GET request to Spotify API
async function fetchFromSpotify(url, accessToken) {
  const response = await fetch(url, {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });

  if (!response.ok) {
    console.error(`Spotify API request failed with status ${response.status}`);
    const responseBody = await response.text();
    console.error(`Response body: ${responseBody}`);
    throw new Error(
      `Spotify API request failed with status ${response.status}`,
    );
  } else {
    return await response.json();
  }
}

// Function to fetch all pages
async function fetchFromSpotifyPaginated(url, accessToken) {
  let items = [];
  let nextPageUrl = url;

  while (nextPageUrl) {
    const data = await fetchFromSpotify(nextPageUrl, accessToken);
    items = items.concat(data.items);

    // If there's a next page, update nextPageUrl, otherwise set it to null
    nextPageUrl = data.next ? data.next : null;
  }
  // returns a list of all concatenated items
  return items;
}

// Function to get a playlist
async function getPlaylist(accessToken, playlistId) {
  return await fetchFromSpotify(
    `${apiBaseUrl}/playlists/${playlistId}`,
    accessToken,
  );
}

// Function to get playlist tracks
async function getPlaylistTracks(accessToken, playlistId) {
  return await fetchFromSpotifyPaginated(
    `${apiBaseUrl}/playlists/${playlistId}/tracks`,
    accessToken,
  );
}

// Function to get saved tracks
async function getSavedTracks(accessToken) {
  return await fetchFromSpotifyPaginated(
    `${apiBaseUrl}/me/tracks`,
    accessToken,
  );
}

// Function to compare playlists
async function comparePlaylists() {
  try {
    // Get access tokens
    const accessToken = await getAccessToken();
    console.log("Logged in!");

    // // Get saved tracks and playlist tracks
    // const savedTracks = await getSavedTracks(accessToken);
    // // console.log("Number of saved tracks:", savedTracks.length);

    // Get playlist info
    const playlist = await getPlaylist(accessToken, playlist2Id);
    console.log(playlist.name);

    // get playlist tracks
    const playlistTracks = await getPlaylistTracks(accessToken, playlist2Id);
    console.log(Object.keys(playlistTracks).length);

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
    console.error("Error:", error.message);
  }
}

// Function to delete songs from a playlist
async function deleteSongs(accessToken, playlistId, songs) {
  const uris = songs.map((song) => song.uri);
  const response = await fetch(`${apiBaseUrl}/playlists/${playlistId}/tracks`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uris }),
  });

  if (!response.ok) {
    throw new Error(`Failed to delete songs: ${response.statusText}`);
  }
}

// Call the function to compare playlists
comparePlaylists();
