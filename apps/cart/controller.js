const { policyFor } = require('../policy');
const Products = require('../products/model');
const CartItems = require('../cart-item/model');

async function update(req, res, next) {
  const policy = policyFor(req.user);
  if (!policy.can('update', 'Carts')) {
    return res.json({
      error: 1,
      message: 'You are not allowed to perform this action',
    });
  }

  try {
    const items = req.body;

    const productsId = items.map((item) => item.product._id);
    const products = await Products.find({ _id: { $in: productsId } });

    const cartItems = items.map((item) => {
      const relatedProduct = products
        .find((product) => product._id.toString() === item.product._id);
      return {
        product: relatedProduct._id,
        price: relatedProduct.price,
        image_url: relatedProduct.image_url,
        name: relatedProduct.name,
        user: req.user._id,
        qty: item.qty,
      };
    });

    await CartItems.deleteMany({ user: req.user._id });

    await CartItems.bulkWrite(cartItems.map((item) => ({
      updateOne: {
        filter: {
          user: req.user._id,
          product: item.product,
        },
        update: item,
        upsert: true,
      },
    })));

    return res.json(cartItems);
  } catch (err) {
    if (err && err.name === 'ValidationError') {
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
  if (!policy.can('read', 'Carts')) {
    return res.json({
      error: 1,
      message: 'You are not allowed to perform this action',
    });
  }
  try {
    const { limit = 10, skip = 0 } = req.query;
    const count = await CartItems.find({ user: req.user._id }).countDocuments();
    const items = await CartItems
      .find({ user: req.user._id })
      .limit(parseInt(limit, 10))
      .skip(parseInt(skip, 10))
      .populate('product');
    return res.json({
      data: items,
      count,
    });
  } catch (err) {
    if (err && err.name === 'ValidationError') {
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
  update,
  index,
};
