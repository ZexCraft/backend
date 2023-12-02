const router = require("express").Router();
const passport = require("passport");
const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");
const svg2img = require("svg2img");

router.post("/store", async (req, res) => {
  const { metadataString } = req.body;

  try {
    const metadataFilePath = "./metadata.json";

    fs.writeFileSync(metadataFilePath, metadataString, { encoding: "utf-8" });

    const formData = new FormData();
    formData.append("file", fs.createReadStream(metadataFilePath));

    // Make the request to the NFT storage API
    const response = await axios.post(
      "https://api.nft.storage/upload",
      formData,
      {
        headers: {
          Authorization: `Bearer ${process.env.NFT_STORAGE_KEY}`,
          ...formData.getHeaders(),
        },
      }
    );

    console.log(response.data);
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/hello", async (req, res) => {
  res.status(200).json({ response: "hello v1" });
});

router.post("/image", async (req, res) => {
  const { image } = req.body;
  console.log(image);

  try {
    const { data } = await axios.get(image);
    const imageBuffer = Buffer.from(data, "binary");

    const tempFilePath = path.join(__dirname, "image.jpg");
    fs.writeFileSync(tempFilePath, imageBuffer);
    // Create FormData
    const formData = new FormData();
    formData.append("file", fs.createReadStream(tempFilePath), {
      filename: "image.jpg",
    });

    const response = await axios.post(
      "https://api.nft.storage/upload",
      formData,
      {
        headers: {
          Authorization: `Bearer ${process.env.NFT_STORAGE_KEY}`,
          ...formData.getHeaders(),
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const LinkedInStrategy = require("@sokratis/passport-linkedin-oauth2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
require("dotenv").config();
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
let googleaccesstoken;
let Linkedinaccesstoken;
let githubaccesstoken;
let facebookaccesstoken;
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      console.log(profile);
      googleaccesstoken = accessToken;
      done(null, profile);
    }
  )
);
router.get("/google/accesstoken", (req, res) => {
  res.json({ accessToken: googleaccesstoken });
});

passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_KEY,
      clientSecret: process.env.LINKEDIN_SECRET,
      callbackURL: "/auth/linkedin/callback",
      scope: ["r_liteprofile"],
    },
    function (accessToken, refreshToken, profile, done) {
      console.log(profile);
      Linkedinaccesstoken = accessToken;
      done(null, profile);
    }
  )
);
router.get("/linkedin/accesstoken", (req, res) => {
  res.json({ accessToken: Linkedinaccesstoken });
});
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      console.log(profile);
      githubaccesstoken = accessToken;
      done(null, profile);
    }
  )
);
router.get("/github/accesstoken", (req, res) => {
  res.json({ accessToken: githubaccesstoken });
});

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "/auth/facebook/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      console.log(profile);
      facebookaccesstoken = accessToken;
      done(null, profile);
    }
  )
);
router.get("/facebook/accesstoken", (req, res) => {
  res.json({ accessToken: facebookaccesstoken });
});

router.get("/login/success", (req, res) => {
  res.status(200).json({
    success: true,
    message: "User has successfully authenticated.",
    user: req.user,
    email: req.user.emails[0].value,
  });
});
router.get("/login/failed", (req, res) => {
  res.redirect("http://localhost:3000/badges");
});
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email", "openid"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000/badges",
    failureRedirect: "http://localhost:5000/auth/login/failed",
  })
);

router.get("/github", passport.authenticate("github", { scope: ["profile"] }));

router.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: "http://localhost:3000/badges",
    failureRedirect: "http://localhost:5000/auth/login/failed",
  })
);

router.get(
  "/linkedin",
  passport.authenticate("linkedin", { scope: ["profile"] })
);

router.get(
  "/linkedin/callback",
  passport.authenticate("linkedin", {
    successRedirect: "http://localhost:3000/badges",
    failureRedirect: "http://localhost:5000/auth/login/failed",
  })
);
router.get("/facebook", passport.authenticate("facebook"));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "http://localhost:3000/badges",
    failureRedirect: "http://localhost:5000/auth/login/failed",
  })
);

module.exports = router;
