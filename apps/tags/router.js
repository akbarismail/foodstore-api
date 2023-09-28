const router = require('express').Router();
const multer = require('multer');
const tagsController = require('./controller');

router.post('/tags', multer().none(), tagsController.store);
router.put('/tags/:id', multer().none(), tagsController.update);
router.delete('/tags/:id', tagsController.destroy);

module.exports = router;
