import { url } from 'inspector';
import request from 'request';


export function getPlaylist(accessToken, playlistId) {
  return new Promise((resolve, reject) => {
    var options = {
      url: `https://api.spotify.com/v1/playlists/${playlistId}`,
      headers: { 'Authorization': 'Bearer ' + accessToken },
      json: true
    };

    request.get(options, function (error, response, body) {
      if (error) {
        reject(response);
      } else {
        resolve(body);
      }
    });
  });
}

