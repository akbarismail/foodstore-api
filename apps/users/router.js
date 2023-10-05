const router = require('express').Router();
const multer = require('multer');

const usersController = require('./controller');

router.post('/register', multer().none(), usersController.register);

module.exports = router;
