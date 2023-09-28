const Tags = require('./model');

async function store(req, res, next) {
  try {
    const payload = req.body;
    const tags = await new Tags(payload).save();
    return res.json(tags);
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
    const tags = await Tags.findOneAndUpdate({ _id: req.params.id }, payload, {
      new: true,
      runValidators: true,
    });
    return res.json(tags);
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
    const tags = await Tags.findOneAndDelete({ _id: req.params.id });
    return res.json(tags);
  } catch (error) {
    next(error);
  }
}

module.exports = { store, update, destroy };
