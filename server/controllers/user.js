const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const {
  generateAccessToken,
  generateRefreshToken,
} = require('../middlewares/jwt');
const jwt = require('jsonwebtoken');
const sendMail = require('../ultils/sendMail');
const crypto = require('crypto');

//------------------------------------------------------------------------------------------------------------------
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
// xóa refresh token sau khi đăng xuất
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  // kiểm tra xem có token trong cookie hay không
  if (!cookie && !cookie.refreshAccessToken)
    throw new Error('No refresh token in cookies');
  //xóa refreshtoken trong database
  await User.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: '' },
    { new: true }
  );
  // xóa refresh token trong cookies
  res.clearCookie('refreshToken', { httpOnly: true, secure: true });
  return res.status(200).json({
    success: true,
    mes: 'logout success',
  });
});
/// Khi quên mật khẩu => tạo mật khẩu mới bằng email đã đăng kí
// Client gửi mail
// Server check mail : Mail hợp lệ -> gửi mail + link có chứa token để reset password
// Client check mail => click link
// Client gửi api có chứa token
//  Check token(client) === token (server gửi) => change password
const forgotPassword = asyncHandler(async (req, res) => {
  // lấy email người dùng ở query
  const { email } = req.query;
  if (!email) throw new Error('Missing email');
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');
  // tạo reset token và mã hóa bằng hàm createPasswordChangedToken
  const resetToken = user.createPasswordChangedToken();
  await user.save();

  const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn.Link này sẽ hết hạn sau 15 phút kể từ bây giờ. <a href=${process.env.URL_SERVER}/api/user/reset-password/${resetToken}>Click here</a>`;
  // tạo data
  const data = {
    email,
    html,
  };
  const rs = await sendMail(data);
  return res.status(200).json({
    success: true,
    rs,
  });
});
// sau khi mail gửi về api có chứa token -> Reset Password
const resetPassword = asyncHandler(async (req, res) => {
  // lấy password mới được nhập và token từ req.body
  const { password, token } = req.body;
  if (!password && !token) throw new Error('Missing input');
  // mã hóa token bằng crypto để so sánh với passwordResetToken trong dababase
  const passwordResetToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  // tìm user chứa passwordResetToken và passwordResetExpires còn hạn
  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error('Invalid reset Token');
  // tiến hành gán lại các thuộc tính mới cho user
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.passwordChangedAt = Date.now();
  // Lưu
  await user.save();
  return res.status(200).json({
    success: user ? true : false,
    mes: user ? 'Password changed success' : 'Something went wrong',
  });
});

module.exports = {
  register,
  login,
  getCurrent,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
};
