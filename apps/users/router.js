const router = require('express').Router();
const multer = require('multer');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const usersController = require('./controller');

passport.use(new LocalStrategy({ usernameField: 'email' }, usersController.localStrategy));

router.post('/register', multer().none(), usersController.register);
router.post('/login', multer().none(), usersController.login);
router.get('/me', usersController.me);
router.post('/logout', usersController.logout);

module.exports = router;
