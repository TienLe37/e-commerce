const Order = require('../models/order');
const User = require('../models/user');
const Coupon = require('../models/coupon');
const asyncHandler = require('express-async-handler');

// Đơn hàng của user
const createOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { coupon } = req.body;
  const userCart = await User.findById(_id)
    .select('cart')
    .populate('cart.product', 'title price');
  const products = userCart?.cart?.map((el) => ({
    product: el.product._id,
    count: el.quantity,
    color: el.color,
  }));
  let total = userCart?.cart?.reduce(
    (sum, el) => el.product.price * el.quantity + sum,
    0
  );
  const createOrderData = { products, total, orderBy: _id };
  if (coupon) {
    const selectCoupon = await Coupon.findById(coupon);
    total =
      Math.round((total * (1 - selectCoupon.discount / 100)) / 1000) * 1000 ||
      total;
    createOrderData.total = total;
    createOrderData.coupon = coupon;
  }
  const response = await Order.create(createOrderData);
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
