// helper for get request
import { getController } from "../base.js";

// services
import {
  getUserInfo,
  getUserPlaylists,
  getPlaylist,
} from "../../services/spotify/userService.js";

// user
export const user = getController(getUserInfo);

// playlists
export const userPlaylists = getController(getUserPlaylists);

// playlist
export const playlist = getController(getPlaylist);
