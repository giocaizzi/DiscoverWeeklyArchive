// services
import { getUserInfo } from '../../services/spotify/userService.js';



// homepage controller
export function homepage(req, res) {
    // if the user is logged in get user info
    if (req.session.access_token) {
        res.redirect('/user');
    } else {
        // else send login page text
        res.send('Login to use DiscoverWeeklyArchive!');
    }
}



// user controller
export function user(req, res) {
        getUserInfo(req.session.access_token)
            .then(
                // if successful send user info
                userInfo => res.send(userInfo))
            .catch(
                // else send error
                error => res.status(500).send(error));
}  