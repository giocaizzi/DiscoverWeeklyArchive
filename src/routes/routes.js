import express from 'express';

// controllers
import { login,callback,logout, refreshToken } from '../controllers/spotify/loginControllers.js';
import { homepage,user } from '../controllers/spotify/userControllers.js';
import { discoverWeeklyArchiveController } from '../controllers/discoverWeeklyArchiveController.js';


// set router
const router = express.Router();

// homepage
router.get('/', homepage);
// login
router.get('/login', login);
// callback
// application requests refresh and access tokens
// after checking the state parameter
router.get('/callback', callback);
// logout
router.get('/logout', logout);
// refresh token when expired
router.get('/refresh-token',refreshToken );

//user
router.get('/user', user);

//discover-weekly-archive
router.get('/discover-weekly-archive/:playlistId', discoverWeeklyArchiveController);

export default router;
