const router = require('express').Router();
const multer = require('multer');
const os = require('os');

const productsController = require('./controller');

router.get('/products', productsController.index);
router.post(
  '/products',
  multer({ dest: os.tmpdir() }).single('image_url'),
  productsController.store,
);
router.put(
  '/products/:id',
  multer({ dest: os.tmpdir() }).single('image_url'),
  productsController.update,
);
router.delete('/products/:id', productsController.destroy);

module.exports = router;
