import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Set port to 8888 if not specified in .env file
const port = process.env.PORT || 8888;

// Set up configuration object
const config = {
  // // SPOTIFY API
  // credentials from Spotify Developer Dashboard
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  // Redirect URI for Spotify API
  redirect_uri: "http://localhost:" + port + "/callback",

  // // SERVER
  // Port to run the server on
  port: port,
  baseurl: "http://localhost:" + port + "/",

  // // EXPRESS
  // secret
  session_secret: process.env.SESSION_SECRET,
  // State key
  stateKey: process.env.STATE_KEY,
};

export default config;
