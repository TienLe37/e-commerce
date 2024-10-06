const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const verifyAccessToken = asyncHandler(async (req, res, next) => {
  if (req?.header?.authorization?.startsWith('Bearer')) {
    const token = req.header.authorization.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err)
        return res.status(401).json({
          success: false,
          mes: 'Invalid AccessToken',
        });
      console.log(decode);
      req.user = decode;
      next();
    });
  } else {
    return res.status(401).json({
      success: false,
      mes: 'Yêu cầu Xác thựcc',
    });
  }
});

module.exports = {
  verifyAccessToken,
};
