import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 8888;

const config = {
    client_id : process.env.CLIENT_ID,
    client_secret : process.env.CLIENT_SECRET,
    port:port,
    redirect_uri : 'http://localhost:' + port + '/callback',
    baseurl : "http://localhost:" + port + "/",
    session_secret : process.env.SESSION_SECRET,
    stateKey : 'spotify_auth_state',
}

export default config;
