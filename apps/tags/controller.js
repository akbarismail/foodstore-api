const Tags = require('./model');
const { policyFor } = require('../policy');

async function store(req, res, next) {
  try {
    const policy = policyFor(req.user);
    if (!policy.can('create', 'Tags')) {
      return res.json({
        error: 1,
        message: 'You do not have an access for create tag',
      });
    }

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
  return true;
}

async function update(req, res, next) {
  try {
    const policy = policyFor(req.user);
    if (!policy.can('update', 'Tags')) {
      return res.json({
        error: 1,
        message: 'You do not have an access for update tag',
      });
    }

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
  return true;
}

async function destroy(req, res, next) {
  try {
    const policy = policyFor(req.user);
    if (!policy.can('delete', 'Tags')) {
      return res.json({
        error: 1,
        message: 'You do not have an access for delete tag',
      });
    }

    const tags = await Tags.findOneAndDelete({ _id: req.params.id });
    return res.json(tags);
  } catch (error) {
    next(error);
  }
  return true;
}

module.exports = { store, update, destroy };
