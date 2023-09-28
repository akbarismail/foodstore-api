const Products = require('./model');
const path = require('path');
const fs = require('fs');
const { rootPath } = require('../config');
const Categories = require('../categories/model');
const Tags = require('../tags/model');

async function store(req, res, next) {
  try {
    let payload = req.body;

    if (payload.category) {
      let categories = await Categories.findOne({
        name: { $regex: payload.category, $options: 'i' },
      });
      if (categories) {
        payload = { ...payload, category: categories._id };
      } else {
        delete payload.category;
      }
    }

    if (payload.tags && payload.tags.length) {
      let tags = await Tags.find({ name: { $in: payload.tags } });
      if (tags.length) {
        payload = { ...payload, tags: tags.map((tag) => tag._id) };
      }
    }

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
    let { limit = 10, skip = 0, q = '', category = '', tags = [] } = req.query;
    let criteria = {};

    if (q.length) {
      criteria = { ...criteria, name: { $regex: `${q}`, $options: 'i' } };
    }

    if (category.length) {
      category = await Categories.findOne({
        name: { $regex: `${category}`, $options: 'i' },
      });
      if (category) {
        criteria = { ...criteria, category: category._id };
      }
    }

    if (tags.length) {
      tags = await Tags.find({ name: { $in: tags } });
      criteria = { ...criteria, tags: { $in: tags.map((tag) => tag._id) } };
    }

    let products = await Products.find(criteria)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate('category')
      .populate('tags');
    res.json(products);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    let payload = req.body;

    if (payload.category) {
      let categories = await Categories.findOne({
        name: { $regex: payload.category, $options: 'i' },
      });
      if (categories) {
        payload = { ...payload, category: categories._id };
      } else {
        delete payload.category;
      }
    }

    if (payload.tags && payload.tags.length) {
      let tags = await Tags.find({ name: { $in: payload.tags } });
      if (tags.length) {
        payload = { ...payload, tags: tags.map((tag) => tag._id) };
      }
    }

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
