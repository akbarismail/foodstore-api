const Categories = require('./model');
const { policyFor } = require('../policy');

async function store(req, res, next) {
  try {
    const policy = policyFor(req.user);
    if (!policy.can('create', 'Categories')) {
      return res.json({
        error: 1,
        message: 'You do not have an access for create category',
      });
    }

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
  return true;
}

async function update(req, res, next) {
  try {
    const policy = policyFor(req.user);
    if (!policy.can('update', 'Categories')) {
      return res.json({
        error: 1,
        message: 'You do not have an access for update category',
      });
    }

    const payload = req.body;
    const categories = await Categories.findOneAndUpdate(
      { _id: req.params.id },
      payload,
      { new: true, runValidators: true },
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
  return true;
}

async function destroy(req, res, next) {
  try {
    const policy = policyFor(req.user);
    if (!policy.can('delete', 'Categories')) {
      return res.json({
        error: 1,
        message: 'You do not have an access for delete category',
      });
    }

    const categories = await Categories.findOneAndDelete({
      _id: req.params.id,
    });
    return res.json(categories);
  } catch (error) {
    next(error);
  }
  return true;
}

module.exports = {
  store,
  update,
  destroy,
};
