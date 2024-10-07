const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const {
  generateAccessToken,
  generateRefreshToken,
} = require('../middlewares/jwt');
const jwt = require('jsonwebtoken');

const register = asyncHandler(async (req, res) => {
  const { email, password, firstname, lastname } = req.body;
  if (!email || !password || !lastname || !firstname)
    return res.status(400).json({
      sucess: false,
      mes: 'Missing inputs',
    });

  const user = await User.findOne({ email });
  if (user) throw new Error('User has existed');
  else {
    const newUser = await User.create(req.body);
    return res.status(200).json({
      sucess: newUser ? true : false,
      mes: newUser
        ? 'Register is successfully. Please go login~'
        : 'Something went wrong',
    });
  }
});
// Refresh token => Cấp mới access token
// Access token => Xác thực người dùng, quân quyên người dùng
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({
      sucess: false,
      mes: 'Missing inputs',
    });
  // plain object
  const response = await User.findOne({ email });
  if (response && (await response.isCorrectPassword(password))) {
    const { password, role, ...userData } = response.toObject();
    // tao accessToken: Xác thực và phân quyền người dùng
    const accessToken = generateAccessToken(response._id, role);
    // tao refreshToken : Dùng để tạo mới accessToken khi accessToken đã hết hạn
    const refreshToken = generateRefreshToken(response._id);
    // Luu refreshToken vao Database
    await User.findByIdAndUpdate(response._id, { refreshToken }, { new: true });
    // Luu refreshToken vao Cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      accessToken,
      userData,
    });
  } else {
    throw new Error('Login Khong thanh cong');
  }
});
// Get User current
const getCurrent = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id).select(
    '-refreshToken -password -role '
  );
  return res.status(200).json({
    success: user ? true : false,
    rs: user ? user : 'User not found',
  });
});
// refreshAcessToken : dùng refreshToken để tạo accessToken mới
const refreshAccessToken = asyncHandler(async (req, res) => {
  // Lay token tu cookies
  const cookie = req.cookies;
  // Kiểm tra xem có tokentrong cookies không
  if (!cookie && !cookie.refreshToken)
    throw new Error('No refreshToken in cookies');
  // Kiem tra token còn hạn hay không rs: result
  const rs = jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
  // tìm kiếm user : findOne :  so sánh id với rs.id | refreshToken lưu trong database với lưu trên cookies có match không
  const response = await User.findOne({
    _id: rs._id,
    refreshToken: cookie.refreshToken,
  });
  return res.status(200).json({
    success: response ? true : false,
    newAccessToken: response
      ? generateAccessToken(response._id, response.role)
      : ' refreshToken not match',
  });
});
module.exports = {
  register,
  login,
  getCurrent,
  refreshAccessToken,
};
