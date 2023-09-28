const Products = require('./model');
const path = require('path');
const fs = require('fs');
const { rootPath } = require('../config');

async function store(req, res, next) {
  try {
    const payload = req.body;

    if (req.file) {
      let tmp_path = req.file.path;
      let originalExt =
        req.file.originalname.split('.')[
          req.file.originalname.split('.').length - 1
        ];
      let filename = req.file.filename + '.' + originalExt;
      let target_path = path.resolve(rootPath, `public/upload/${filename}`);

      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);

      src.on('end', async () => {
        try {
          let products = await Products({
            ...payload,
            image_url: filename,
          }).save();
          return res.json(products);
        } catch (error) {
          fs.unlinkSync(target_path);
          if (error && error.name === 'ValidationError') {
            return res.json({
              error: 1,
              message: error.message,
              fields: error.errors,
            });
          }
          next(error);
        }
      });
      src.on('error', async (error) => {
        next(error);
      });
    } else {
      const products = await Products(payload).save();
      return res.json(products);
    }
  } catch (error) {
    if (error && error.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: error.message,
        fields: error.errors,
      });
    }
    next(error);
  }
}

async function index(req, res, next) {
  try {
    const { limit = 10, skip = 0 } = req.query;
    let products = await Products.find()
      .limit(parseInt(limit))
      .skip(parseInt(skip));
    res.json(products);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const payload = req.body;

    if (req.file) {
      let tmp_path = req.file.path;
      let originalExt =
        req.file.originalname.split('.')[
          req.file.originalname.split('.').length - 1
        ];
      let filename = req.file.filename + '.' + originalExt;
      let target_path = path.resolve(rootPath, `public/upload/${filename}`);

      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);

      src.on('end', async () => {
        try {
          let products = await Products.findOne({ _id: req.params.id });

          let currentImage = `${rootPath}/public/upload/${products.image_url}`;
          if (fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage);
          }

          products = await Products.findOneAndUpdate(
            { _id: req.params.id },
            { ...payload, image_url: filename },
            { new: true, runValidators: true }
          );
          return res.json(products);
        } catch (error) {
          fs.unlinkSync(target_path);
          if (error && error.name === 'ValidationError') {
            return res.json({
              error: 1,
              message: error.message,
              fields: error.errors,
            });
          }
          next(error);
        }
      });
      src.on('error', async (error) => {
        next(error);
      });
    } else {
      const products = await Products.findOneAndUpdate(
        { _id: req.params.id },
        payload,
        { new: true, runValidators: true }
      );
      return res.json(products);
    }
  } catch (error) {
    if (error && error.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: error.message,
        fields: error.errors,
      });
    }
    next(error);
  }
}

async function destroy(req, res, next) {
  try {
    let products = await Products.findOneAndDelete({ _id: req.params.id });
    let currentImage = `${rootPath}/public/upload/${products.image_url}`;
    if (fs.existsSync(currentImage)) {
      fs.unlinkSync(currentImage);
    }
    return res.json(products);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  store,
  index,
  update,
  destroy,
};
