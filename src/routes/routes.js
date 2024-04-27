import express from "express";

// controllers
import {
  login,
  callback,
  logout,
  refreshToken,
} from "../controllers/spotify/loginControllers.js";
import { homepage } from "../controllers/homeController.js";
import {
  user,
  userPlaylists,
  playlist,
} from "../controllers/spotify/spotifyControllers.js";
import { discoverWeeklyArchiveController } from "../controllers/discoverWeeklyArchiveController.js";

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
// user info
router.get("/user", user);
// user playlists
router.get("/user/playlists", userPlaylists);
// playlist
router.get("/user/playlists/:playlistId", playlist);

//////////////////////////
//discover-weekly-archive
router.get(
  "/discover-weekly-archive/:playlistId",
  discoverWeeklyArchiveController,
);

export default router;
