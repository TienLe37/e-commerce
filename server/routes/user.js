const router = require('express').Router();
const ctrls = require('../controllers/user');
const uploader = require('../config/cloudinary.config');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');
//
router.post('/register', ctrls.register);
router.post('/mock', ctrls.createUsers);
router.put('/finalregister/:token', ctrls.finalRegister);
router.post('/login', ctrls.login);
router.get('/current', verifyAccessToken, ctrls.getCurrent);
router.post('/refreshtoken', ctrls.refreshAccessToken);
router.get('/logout', ctrls.logout);
router.post('/forgotpassword', ctrls.forgotPassword);
router.put('/resetpassword', ctrls.resetPassword);
router.get('/', [verifyAccessToken, isAdmin], ctrls.getUsers);
router.delete('/:uid', [verifyAccessToken, isAdmin], ctrls.deleteUser);
router.put('/current', verifyAccessToken,uploader.single('avatar'), ctrls.updateUser);
router.put('/address/', verifyAccessToken, ctrls.updateUserAddress);
router.put('/addtocart', verifyAccessToken, ctrls.addToCart);
router.delete('/remove-cart/:pid/:color', verifyAccessToken, ctrls.removeProductfromCart);
router.put('/:uid', [verifyAccessToken, isAdmin], ctrls.updateUserByAdmin);

module.exports = router;

// CRUD | Create - Read - Update - Delete | POST - GET - PUT - DELETEeee
// CREATE (POST) + PUT - body
// GET + DELETE - query // ?fdfdsf&fdfs
