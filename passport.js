const passport = require('passport');

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const LinkedInStrategy = require('@sokratis/passport-linkedin-oauth2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
require('dotenv').config();
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    done(null, profile);
  }
));

passport.serializeUser((user, done)=> {
    done(null, user);
})
passport.deserializeUser((user, done)=> {
    done(null, user);
})
passport.use(new LinkedInStrategy({
  clientID: process.env.LINKEDIN_KEY,
  clientSecret: process.env.LINKEDIN_SECRET,
  callbackURL: "/auth/linkedin/callback",
  scope: ['r_liteprofile'],
}, function(accessToken, refreshToken, profile, done) {
  console.log(profile);
  done(null, profile);
}));
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "/auth/github/callback"
},
function(accessToken, refreshToken, profile, done) {
  console.log(profile);
  done(null, profile);
}
));

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "/auth/facebook/callback"
},
function(accessToken, refreshToken, profile, done) {
  console.log(profile);
  done(null, profile);
}
));