const router = require('express').Router();
const passport = require('passport');

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const LinkedInStrategy = require('@sokratis/passport-linkedin-oauth2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
require('dotenv').config();
passport.serializeUser((user, done)=> {
    done(null, user);
})
passport.deserializeUser((user, done)=> {
    done(null, user);
})
let googleaccesstoken;
let Linkedinaccesstoken;
let githubaccesstoken;
let facebookaccesstoken;
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    googleaccesstoken = accessToken;
    done(null, profile);
   
  }
));
router.get('/google/accesstoken', (req, res) => {
    res.json({ accessToken: googleaccesstoken });
  });

passport.use(new LinkedInStrategy({
  clientID: process.env.LINKEDIN_KEY,
  clientSecret: process.env.LINKEDIN_SECRET,
  callbackURL: "/auth/linkedin/callback",
  scope: ['r_liteprofile'],
},
function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    Linkedinaccesstoken = accessToken;
    done(null, profile);
}));
router.get('/linkedin/accesstoken', (req, res) => {
    res.json({ accessToken: Linkedinaccesstoken });
  });
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "/auth/github/callback"
},
function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    githubaccesstoken = accessToken;
    done(null, profile);
}));
router.get('/github/accesstoken', (req, res) => {
    res.json({ accessToken: githubaccesstoken });
  });

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "/auth/facebook/callback"
},
function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    facebookaccesstoken = accessToken;
    done(null, profile);
}));
router.get('/facebook/accesstoken', (req, res) => {
    // Generate or fetch the value to send to the frontend      
    // Send the value as part of the response
    res.json({ accessToken: facebookaccesstoken });
  });


router.get('/login/success', (req, res) =>{

    res.status(200).json({
        success: true,
        message: 'User has successfully authenticated.',
        user: req.user,
        email: req.user.emails[0].value,
    })
})
router.get('/login/failed', (req, res) =>{
    res.redirect('http://localhost:3000/badges')
})
router.get('/google', passport.authenticate('google', {scope: ['profile', 'email','openid']}));

router.get('/google/callback', passport.authenticate('google',{
    successRedirect: 'http://localhost:3000/badges',
    failureRedirect: 'http://localhost:5000/auth/login/failed'
}))

router.get('/github', passport.authenticate('github', {scope: ['profile']}));

router.get('/github/callback', passport.authenticate('github',{
    successRedirect: 'http://localhost:3000/badges',
    failureRedirect: 'http://localhost:5000/auth/login/failed'
}))

router.get('/linkedin', passport.authenticate('linkedin', {scope: ['profile']}));

router.get('/linkedin/callback', passport.authenticate('linkedin',{
    successRedirect: 'http://localhost:3000/badges',
    failureRedirect: 'http://localhost:5000/auth/login/failed'
}))
router.get('/facebook', passport.authenticate('facebook'));

router.get('/facebook/callback', passport.authenticate('facebook',{
    successRedirect: 'http://localhost:3000/badges',
    failureRedirect: 'http://localhost:5000/auth/login/failed'
}))

module.exports = router;