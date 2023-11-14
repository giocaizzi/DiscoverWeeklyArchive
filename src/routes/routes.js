import express from 'express';

// controllers
import { login,callback,logout, refreshToken } from '../controllers/loginControllers.js';
import { homepage,user } from '../controllers/userControllers.js';


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

//user
router.get('/user', user);

export default router;
