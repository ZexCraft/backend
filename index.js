const cookieSession = require('cookie-session');
const express = require('express');
const passport = require('passport');
const cors = require('cors');
const bodyParser = require('body-parser');
// const passportSetup = require('./passport');
const authRoute = require('./routes/auth');
const app = express();
const port = process.env.PORT || 5000;
const http = require('http');
app.use(cookieSession({
    name: 'session',
    keys: ['zhixin'],
    maxAge: 120 * 1000 // 2 minutes

}))
app.use(express.json())
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: "GET,PUT,POST,DELETE",
    credentials: true
}))
app.use('/auth', authRoute)
app.use(bodyParser.json());

server.listen(port);