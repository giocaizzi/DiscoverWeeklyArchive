/*
Based off of Spotify's example code for authorization code flow
https://github.com/spotify/web-api-examples/blob/master/authorization/authorization_code/app.js
*/

import express from "express";
import session from "express-session";
import cors from "cors";
import cookieParser from "cookie-parser";

// routes
import routes from "./routes.js";
import config from "./config.js";

var app = express();

// TODO: verify
app.use(cors()).use(cookieParser());

// session
app.use(
  session({
    secret: config.session_secret,
    // other config
    resave: false, // don't save session if unmodified
    saveUninitialized: true, // don't create session until something stored
    cookie: { secire: false }, // set tot true if https
  }),
);

// Routes
app.use("/", routes);

// Main
app.listen(config.port, () => {
  console.log(`App listening at http://localhost:${config.port}`);
});
