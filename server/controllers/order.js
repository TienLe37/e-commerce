const Order = require('../models/order');
const User = require('../models/user');
const Coupon = require('../models/coupon');
const asyncHandler = require('express-async-handler');

// Đơn hàng của user
const createOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const {products, total, address ,status} = req.body
  if(address) {
    await User.findByIdAndUpdate( _id, { cart: [] });
  }
  const data = {products, total, address, orderBy: _id}
  if(status) data.status = status
  const response = await Order.create(data);
  return res.json({
    success: response ? true : false,
    rs: response ? response : 'Cannot create order',
  });
});

const updateStatus = asyncHandler(async (req, res) => {
  const { oid } = req.params;
  const { status } = req.body;
  if (!status) throw new Error('Missing status');
  const response = await Order.findByIdAndUpdate(
    oid,
    { status },
    { new: true }
  );

  return res.json({
    success: response ? true : false,
    rs: response ? response : 'Cannot update status',
  });
});

const getUserOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const response = await Order.find({ orderBy: _id });
  return res.json({
    success: response ? true : false,
    rs: response ? response : 'Cannot get user order',
  });
});
const getOrders = asyncHandler(async (req, res) => {
  const response = await Order.find();
  return res.json({
    success: response ? true : false,
    rs: response ? response : 'Cannot get orders',
  });
});

module.exports = {
  createOrder,
  updateStatus,
  getUserOrder,
  getOrders,
};
