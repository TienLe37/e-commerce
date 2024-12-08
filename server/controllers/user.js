const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const {
  generateAccessToken,
  generateRefreshToken,
} = require('../middlewares/jwt');
const jwt = require('jsonwebtoken');
const sendMail = require('../ultils/sendMail');
const crypto = require('crypto');
const makeToken = require('uniqid');
const { users } = require('../ultils/constants');
const path = require('path');

//------------------------------------------------------------------------------------------------------------------
// Đăng ký : Active đăng kí qua email
const register = asyncHandler(async (req, res) => {
  const { email, password, firstname, lastname, mobile } = req.body;
  if (!email || !password || !lastname || !firstname || !mobile)
    return res.status(400).json({
      success: false,
      mes: 'Vui lòng nhập đủ thông tin',
    });
  // kiểm tra email đã tồn tại chưa
  const user = await User.findOne({ email });
  if (user) throw new Error('Email đã tồn tại');
  else {
    const token = makeToken(); // tạo token
    const emailedited = btoa(email) + '@' + token;
    const newUser = await User.create({
      email: emailedited,
      password,
      firstname,
      lastname,
      mobile,
    });
    if (newUser) {
      const html = `<h3> Mã xác thực đăng kí. Mã sẽ hết hạn sau 5 phút.</h3> <br/> <blockqoute>${token}</blockqoute> `;
      // Gửi mail
      await sendMail({
        email,
        html,
        subject: 'Hoàn tất xác thực đăng ký tài khoản UET SHOP',
      });
    }
    setTimeout(async () => {
      await User.deleteOne({ email: emailedited });
    }, [300000]);
    return res.json({
      success: true,
      mes: 'Please check your email to active register',
    });
  }
});
// Hoàn tất đăng kí bằng mail
const finalRegister = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const notActivedEmail = await User.findOne({
    email: new RegExp(`${token}$`),
  });
  if (notActivedEmail) {
    notActivedEmail.email = atob(notActivedEmail?.email?.split('@')[0]);
    notActivedEmail.save();
  }
  return res.json({
    success: notActivedEmail ? true : false,
    mes: notActivedEmail
      ? 'Đăng kí tài khoản thành công'
      : 'Something went wrong',
  });
});
// Refresh token => Cấp mới access token
// Access token => Xác thực người dùng, quân quyên người dùng
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({
      success: false,
      mes: 'Vui lòng nhập đủ thông tin',
    });
  // plain object
  const response = await User.findOne({ email });
  if (response && (await response.isCorrectPassword(password))) {
    const { password, role, refreshToken, ...userData } = response.toObject();
    // tao accessToken
    const accessToken = generateAccessToken(response._id, role);
    // tao refreshToken : Dùng để tạo mới accessToken khi accessToken đã hết hạn
    const newRefreshToken = generateRefreshToken(response._id);
    // Luu refreshToken vao Database
    await User.findByIdAndUpdate(
      response._id,
      { refreshToken: newRefreshToken },
      { new: true }
    );
    // Luu refreshToken vao Cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      accessToken,
      userData,
    });
  } else {
    throw new Error('Đăng nhập thất bại');
  }
});
// Get User current
const getCurrent = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id).select('-refreshToken -password').populate({
    path: 'cart',
    populate: {
      path: 'product',
      select: 'title thumb price'
    }
  });
  return res.status(200).json({
    success: user ? true : false,
    rs: user ? user : 'Không tìm thấy User',
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
    mes: 'Đăng xuất thành công!',
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
  const { email } = req.body;
  if (!email) throw new Error('Vui lòng điền email');
  const user = await User.findOne({ email });
  if (!user) throw new Error('Email không tồn tại!');
  // tạo reset token và mã hóa bằng hàm createPasswordChangedToken
  const resetToken = user.createPasswordChangedToken();
  await user.save();

  const html = `Xin vui lòng click vào link dưới đây để đặt lại mật khẩu của bạn.Link này sẽ hết hạn sau 15 phút kể từ bây giờ. <a href=${process.env.CLIENT_URL}/reset-password/${resetToken}>Click here</a>`;
  // tạo data
  const data = {
    email,
    html,
    subject: 'Forgot password',
  };
  const rs = await sendMail(data);
  return res.status(200).json({
    success: rs.response?.includes('OK') ? true : false,
    mes: rs.response?.includes('OK')
      ? 'Vui lòng kiểm tra mail của bạn.'
      : 'Some thing went wrong',
  });
});
// sau khi mail gửi về api có chứa token -> Reset Password
const resetPassword = asyncHandler(async (req, res) => {
  // lấy password mới được nhập và token từ req.body
  const { password, token } = req.body;
  if (!password && !token) throw new Error('Vui lòng nhập mật khẩu mới');
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
    mes: user
      ? ' Mật khẩu đã được thay đổi thành công '
      : 'Something went wrong',
  });
});

// get all user : role: admin
const getUsers = asyncHandler(async (req, res) => {
  const queries = { ...req.query };
  const excludeFields = ['limit', 'sort', 'page', 'fields'];
  excludeFields.forEach((el) => delete queries[el]);
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`
  );
  const formatedQueries = JSON.parse(queryString);
  // Filtering
  if (queries?.name)
    formatedQueries.name = { $regex: queries.name, $options: 'i' };
  if (req.query.q) {
    delete formatedQueries.q;
    formatedQueries['$or'] = [
      { firstname: { $regex: req.query.q, $options: 'i' } },
      { lastname: { $regex: req.query.q, $options: 'i' } },
      { email: { $regex: req.query.q, $options: 'i' } },
    ];
  }
  let queryCommand = User.find(formatedQueries);
  //Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    queryCommand = queryCommand.sort(sortBy);
  }
  // Lọc các fields muốn lấy ra ( hoặc không)
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    queryCommand = queryCommand.select(fields);
  }
  /** PHÂN TRANG(pagingnation)
   * Limit: số Object lấy ra sau 1 lần gọi api
   * page: số thứ tự trang: 1 2 3 ......10 ......
   * skip: skip số Obbject
   **/
  const limit = +req.query.limit || process.env.LIMIT_USER;
  const page = +req.query.page || 1;
  const skip = (page - 1) * limit;
  queryCommand = queryCommand.skip(skip).limit(limit);
  // thực thi hàm queryCommand
  queryCommand
    .then(async (response) => {
      const counts = await User.find(formatedQueries).countDocuments(); // counts: số lượng sản phẩm thỏa mãn điều kiện
      return res.status(200).json({
        success: counts >= 0 ? true : false,
        counts,
        users: counts >= 0 ? response : 'Cannot get Users',
      });
    })
    .catch((err) => console.log(err));
});

// Delete user : role : admin
const deleteUser = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  const response = await User.findByIdAndDelete(uid);
  return res.status(200).json({
    success: response ? true : false,
    mes: response
      ? `User with email: ${response.email} is deleted`
      : 'No user delete ',
  });
});
// Update user by admin
const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  if (Object.keys(req.body).length === 0)
    throw new Error('Vui lòng nhập đủ thông tin');
  const response = await User.findByIdAndUpdate(uid, req.body, {
    new: true,
  }).select('-password  -role -refreshToken');
  return res.status(200).json({
    success: response ? true : false,
    mes: response ? 'Update user success' : 'Something went wrong',
  });
});
// Update user by user
const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { email, firstname, lastname, mobile } = req.body;
  const data = { email, firstname, lastname, mobile}
  if(req.file) data.avatar = req.file?.path
  if (!_id || Object.keys(req.body).length === 0)
    throw new Error('Missing inputs');
  const response = await User.findByIdAndUpdate(_id, data, {
    new: true,
  }).select('-password  -role -refreshToken');
  return res.status(200).json({
    success: response ? true : false,
    mes: response ? 'Update success' : 'Something went wrong ',
  });
});

// Thêm địc chỉ user
const updateUserAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!req.body.address) throw new Error('Vui lòng nhập đủ thông tin');
  const response = await User.findByIdAndUpdate(
    _id,
    { $push: { address: req.body.address } },
    { new: true }
  ).select('-password  -role -refreshToken');
  return res.status(200).json({
    success: response ? true : false,
    upDateAddress: response ? response : 'Cannot update address  ',
  });
});
// Thêm sản phẩm vào giỏ hàng
const addToCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { pid, quantity = 1, color, price , thumb , title } = req.body;
  if (!pid || !color)
    throw new Error('Vui lòng nhập đủ thông tin');
  const user = await User.findById(_id).select('cart');
  // Tìm trong giỏ hàng xem có product chưa
  const alreadyProduct = user?.cart?.find((el) => el.product.toString() === pid && el.color === color);
  if (alreadyProduct) {
    // nếu đã có product
      const response = await User.updateOne(
        { cart: { $elemMatch: alreadyProduct } },
        { $set: { 'cart.$.quantity': +alreadyProduct?.quantity + quantity , 'cart.$.price': price , 'cart.$.thumb': thumb , 'cart.$.title': title } },
        { new: true }
      );
      return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Added to Cart ' : 'Something went wrong ',
      });
  } else {
    const response = await User.findByIdAndUpdate(_id, { $push: { cart: { product: pid, quantity, color, price, thumb ,title } } }, { new: true });
    return res.status(200).json({
      success: response ? true : false,
      mes: response ? 'Added to Cart ' : 'Something went wrong ',
    });
  }
});
// remove product from cart
const removeProductfromCart = asyncHandler(async (req, res) => {
  const { _id } = req.user
  const { pid , color} = req.params
  const user = await User.findById(_id).select('cart')
  const alreadyProduct = user?.cart?.find((el) => el.product.toString() === pid && el.color === color) ;
  if(!alreadyProduct) {
    return res.status(200).json({
      success: true,
      mes: 'Removed product.'
    }); 
  }
  const response = await User.findByIdAndUpdate(_id, { $pull: { cart: { product: pid , color} } }, { new: true });
  return res.status(200).json({
    success: response ? true : false,
    mes: response ? 'Removed product from cart ' : 'Something went wrong ',
  });
});
/// mock User
const createUsers = asyncHandler(async (req, res) => {
  const response = await User.create(users);
  return res.status(200).json({
    success: response ? true : false,
    users: response ? response : 'Cannot create user',
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
  getUsers,
  deleteUser,
  updateUser,
  updateUserByAdmin,
  updateUserAddress,
  addToCart,
  finalRegister,
  createUsers,
  removeProductfromCart
};
