const { subject } = require('@casl/ability');
const DeliveryAddress = require('./model');
const { policyFor } = require('../policy');

async function store(req, res, next) {
  const policy = policyFor(req.user);
  if (!policy.can('create', 'DeliveryAddress')) {
    return res.json({
      error: 1,
      message: 'You are not allowed to perform this action',
    });
  }
  try {
    const payload = req.body;
    const { user } = req;
    const address = new DeliveryAddress({ ...payload, user: user._id });
    await address.save();
    return res.json(address);
  } catch (err) {
    if (err && err.message === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }

    next(err);
  }

  return true;
}

async function update(req, res, next) {
  const policy = policyFor(req.user);
  try {
    const { id } = req.params;
    const { _id, ...payload } = req.body;

    let address = await DeliveryAddress.findOne({ _id: id });

    const subjectAddress = subject(
      'DeliveryAddress',
      { ...address, user: address.user },
    );
    if (!policy.can('update', subjectAddress)) {
      return res.json({
        error: 1,
        message: 'You are not allowed to modify this resource',
      });
    }

    address = await DeliveryAddress.findOneAndUpdate({ _id: id }, payload, { new: true });
    return res.json(address);
  } catch (err) {
    if (err && err.message === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }

    next(err);
  }

  return true;
}

async function destroy(req, res, next) {
  const policy = policyFor(req.user);
  try {
    const { id } = req.params;

    let address = await DeliveryAddress.findOne({ _id: id });
    const subjectAddress = subject('DeliveryAddress', { ...address, user: address.user });
    if (!policy.can('delete', subjectAddress)) {
      return res.json({
        error: 1,
        message: 'You are not allowed to delete this resource',
      });
    }

    address = await DeliveryAddress.findOneAndDelete({ _id: id });
    return res.json(address);
  } catch (err) {
    if (err && err.message === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }

    next(err);
  }

  return true;
}

async function index(req, res, next) {
  const policy = policyFor(req.user);
  if (!policy.can('view', 'DeliveryAddress')) {
    return res.json({
      error: 1,
      message: 'You are not allowed to perform this action',
    });
  }
  try {
    const { limit = 10, skip = 0 } = req.query;

    const count = await DeliveryAddress.find({ user: req.user._id }).countDocuments();

    const deliveryAddresses = await DeliveryAddress
      .find({ user: req.user._id })
      .limit(parseInt(limit, 10))
      .skip(parseInt(skip, 10))
      .sort('-createdAt');

    return res.json({
      data: deliveryAddresses,
      count,
    });
  } catch (err) {
    if (err && err.message === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }

    next(err);
  }

  return true;
}

module.exports = {
  store,
  update,
  destroy,
  index,
};
