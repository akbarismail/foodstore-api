const router = require('express').Router();
const multer = require('multer');
const categoriesController = require('./controlller');

router.post('/categories', multer().none(), categoriesController.store);
router.put('/categories/:id', multer().none(), categoriesController.update);
router.delete('/categories/:id', categoriesController.destroy);

module.exports = router;
