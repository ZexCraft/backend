const router = require('express').Router();
const passport = require('passport');
router.get('/login/success', (req, res) =>{

    res.status(200).json({
        success: true,
        message: 'User has successfully authenticated.',
        user: req.user,
        email: req.user.emails[0].value,
        cookies: req.cookies
    })
})
router.get('/login/failed', (req, res) =>{

    res.status(401).json({
        success: false,
        message: 'User failed to authenticate.'
    })
})
router.get('/google', passport.authenticate('google', {scope: ['profile', 'email','openid']}));

router.get('/google/callback', passport.authenticate('google',{
    successRedirect: 'http://localhost:3000/badges',
    failureRedirect: '/login/failed'
}))

router.get('/github', passport.authenticate('github', {scope: ['profile']}));

router.get('/github/callback', passport.authenticate('github',{
    successRedirect: 'http://localhost:3000/badges',
    failureRedirect: '/login/failed'
}))

module.exports = router;