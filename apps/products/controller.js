const path = require('path');
const fs = require('fs');
const Products = require('./model');
const { rootPath } = require('../config');
const Categories = require('../categories/model');
const Tags = require('../tags/model');

async function store(req, res, next) {
  try {
    let payload = req.body;

    if (payload.category) {
      const categories = await Categories.findOne({
        name: { $regex: payload.category, $options: 'i' },
      });
      if (categories) {
        payload = { ...payload, category: categories._id };
      } else {
        delete payload.category;
      }
    }

    if (payload.tags && payload.tags.length) {
      const tags = await Tags.find({ name: { $in: payload.tags } });
      if (tags.length) {
        payload = { ...payload, tags: tags.map((tag) => tag._id) };
      }
    }

    if (req.file) {
      const tmpPath = req.file.path;
      const originalExt = req.file.originalname.split('.')[
        req.file.originalname.split('.').length - 1
      ];
      const filename = `${req.file.filename}.${originalExt}`;
      const targetPath = path.resolve(rootPath, `public/upload/${filename}`);

      const src = fs.createReadStream(tmpPath);
      const dest = fs.createWriteStream(targetPath);
      src.pipe(dest);

      src.on('end', async () => {
        try {
          const products = await Products({
            ...payload,
            image_url: filename,
          }).save();
          return res.json(products);
        } catch (error) {
          fs.unlinkSync(targetPath);
          if (error && error.name === 'ValidationError') {
            return res.json({
              error: 1,
              message: error.message,
              fields: error.errors,
            });
          }
          next(error);
        }
        return true;
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
  return true;
}

async function index(req, res, next) {
  try {
    const {
      limit = 10, skip = 0, q = '', category = '', tags = [],
    } = req.query;
    let criteria = {};

    if (q.length) {
      criteria = { ...criteria, name: { $regex: `${q}`, $options: 'i' } };
    }

    if (category.length) {
      const findCategory = await Categories.findOne({
        name: { $regex: `${category}`, $options: 'i' },
      });
      if (findCategory) {
        criteria = { ...criteria, category: category._id };
      }
    }

    if (tags.length) {
      const findTags = await Tags.find({ name: { $in: tags } });
      criteria = { ...criteria, tags: { $in: findTags.map((tag) => tag._id) } };
    }

    const products = await Products.find(criteria)
      .limit(parseInt(limit, 10))
      .skip(parseInt(skip, 10))
      .populate('category')
      .populate('tags');
    return res.json(products);
  } catch (error) {
    next(error);
  }

  return true;
}

async function update(req, res, next) {
  try {
    let payload = req.body;

    if (payload.category) {
      const categories = await Categories.findOne({
        name: { $regex: payload.category, $options: 'i' },
      });
      if (categories) {
        payload = { ...payload, category: categories._id };
      } else {
        delete payload.category;
      }
    }

    if (payload.tags && payload.tags.length) {
      const tags = await Tags.find({ name: { $in: payload.tags } });
      if (tags.length) {
        payload = { ...payload, tags: tags.map((tag) => tag._id) };
      }
    }

    if (req.file) {
      const tmpPath = req.file.path;
      const originalExt = req.file.originalname.split('.')[
        req.file.originalname.split('.').length - 1
      ];
      const filename = `${req.file.filename}.${originalExt}`;
      const targetPath = path.resolve(rootPath, `public/upload/${filename}`);

      const src = fs.createReadStream(tmpPath);
      const dest = fs.createWriteStream(targetPath);
      src.pipe(dest);

      src.on('end', async () => {
        try {
          let products = await Products.findOne({ _id: req.params.id });

          const currentImage = `${rootPath}/public/upload/${products.image_url}`;
          if (fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage);
          }

          products = await Products.findOneAndUpdate(
            { _id: req.params.id },
            { ...payload, image_url: filename },
            { new: true, runValidators: true },
          );
          return res.json(products);
        } catch (error) {
          fs.unlinkSync(targetPath);
          if (error && error.name === 'ValidationError') {
            return res.json({
              error: 1,
              message: error.message,
              fields: error.errors,
            });
          }
          next(error);
        }
        return true;
      });
      src.on('error', async (error) => {
        next(error);
      });
    } else {
      const products = await Products.findOneAndUpdate(
        { _id: req.params.id },
        payload,
        { new: true, runValidators: true },
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
  return true;
}

async function destroy(req, res, next) {
  try {
    const products = await Products.findOneAndDelete({ _id: req.params.id });
    const currentImage = `${rootPath}/public/upload/${products.image_url}`;
    if (fs.existsSync(currentImage)) {
      fs.unlinkSync(currentImage);
    }
    return res.json(products);
  } catch (error) {
    next(error);
  }
  return true;
}

module.exports = {
  store,
  index,
  update,
  destroy,
};
