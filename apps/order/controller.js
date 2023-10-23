const mongoose = require('mongoose');
const { policyFor } = require('../policy');
const CartItems = require('../cart-item/model');
const DeliveryAddress = require('../delivery-address/model');
const Orders = require('./model');
const OrderItems = require('../order-item/model');

async function store(req, res, next) {
  const policy = policyFor(req.user);
  if (!policy.can('create', 'Orders')) {
    return res.json({
      error: 1,
      message: 'You are not allowed to perform this action',
    });
  }

  try {
    const { deliveryAddress, deliveryFee } = req.body;

    const items = await CartItems.find({ user: req.user._id }).populate('product');
    if (!items.length) {
      return res.json({
        error: 1,
        message: 'Can not create order because you have no items in the cart',
      });
    }

    const address = await DeliveryAddress.findOne({ _id: deliveryAddress });
    if (!address) {
      return res.json({
        error: 1,
        message: 'Can not create order because you have no address',
      });
    }

    const order = new Orders({
      _id: new mongoose.mongo.ObjectId(),
      status: 'waiting_payment',
      delivery_fee: deliveryFee,
      delivery_address: {
        province: address.province,
        regency: address.regency,
        district: address.district,
        village: address.village,
        detail: address.detail,

      },
      user: req.user._id,
    });

    const orderItems = await OrderItems.insertMany(
      items.map((item) => ({
        ...item,
        name: item.product.name,
        qty: parseInt(item.qty, 10),
        price: parseInt(item.product.price, 10),
        product: item.product._id,
        order: order._id,
      })),
    );
    orderItems.forEach((item) => order.order_items.push(item));

    await order.save();

    await CartItems.deleteMany({ user: req.user._id });

    return res.json(order);
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
  if (!policy.can('view', 'Orders')) {
    return res.json({
      error: 1,
      message: 'You are not allowed to perform this action',
    });
  }
  try {
    const { limit = 10, skip = 0 } = req.query;

    const count = await Orders.find({ user: req.user._id }).countDocuments();

    const orders = await Orders
      .find({ user: req.user._id })
      .limit(parseInt(limit, 10))
      .skip(parseInt(skip, 10))
      .populate('order_items')
      .sort('-createdAt');

    return res.json({
      data: orders.map((order) => order.toJSON({ virtuals: true })),
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
  store,
  index,
};
