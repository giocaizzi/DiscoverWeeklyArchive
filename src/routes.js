import express from "express";

//// SPOTIFY
import {
  login,
  callback,
  logout,
  refreshToken,
} from "./spotify/login/controller.js";
import {
  me,
  tracks,
  playlists,
  playlist,
} from "./spotify/user/controller.js";
//// SMART-SPOTIFY
// homepage
import { homepage } from "./smart-spotify/home.js";
// discover-weekly-archive
import { discoverWeeklyArchiveController } from "./smart-spotify/discover-weekly-archive/controller.js";

// set router
const router = express.Router();

// homepage
router.get("/", homepage);

//////////////////////////
// AUTH
// login
router.get("/login", login);
// callback
// application requests refresh and access tokens
// after checking the state parameter
router.get("/callback", callback);
// logout
router.get("/logout", logout);
// refresh token when expired
router.get("/refresh-token", refreshToken);

//////////////////////////
// USER
// info
router.get("/me", me);
// tracks
router.get("/tracks", tracks);
// playlists
router.get("/playlists", playlists);
// playlist
router.get("/playlists/:playlistId", playlist);

//////////////////////////
//discover-weekly-archive
router.get(
  "/discover-weekly-archive/:playlistId",
  discoverWeeklyArchiveController,
);

export default router;
