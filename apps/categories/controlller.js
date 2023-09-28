const Categories = require('./model');

async function store(req, res, next) {
  try {
    const payload = req.body;
    const categories = await new Categories(payload).save();
    return res.json(categories);
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

async function update(req, res, next) {
  try {
    const payload = req.body;
    const categories = await Categories.findOneAndUpdate(
      { _id: req.params.id },
      payload,
      { new: true, runValidators: true }
    );
    return res.json(categories);
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
    const categories = await Categories.findOneAndDelete({
      _id: req.params.id,
    });
    return res.json(categories);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  store,
  update,
  destroy,
};
