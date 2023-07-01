const cookieSession = require('cookie-session');
const express = require('express');
const passport = require('passport');
const cors = require('cors');
// const passportSetup = require('./passport');
const authRoute = require('./routes/auth');
const app = express();
app.use(cookieSession({
    name: 'session',
    keys: ['zhixin'],
    maxAge: 120 * 1000 // 2 minutes

}))
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: "GET,PUT,POST,DELETE",
    credentials: true
}))
app.use('/auth', authRoute)
app.listen(5000, () => console.log('Server running on port 5000'));
