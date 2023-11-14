import express from 'express';

// controllers
import { homepage,login,callback,logout, refreshToken } from '../controllers/controllers.js';


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
router.get('/refresh_token',refreshToken );

export default router;
