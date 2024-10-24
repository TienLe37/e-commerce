const router = require('express').Router();
const ctrls = require('../controllers/product');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');
const uploadImg = require('../config/cloudinary.config');
router.post('/', [verifyAccessToken, isAdmin], ctrls.createProduct);
router.get('/', ctrls.getProducts);

router.put('/rating', verifyAccessToken, ctrls.ratings);
router.put('/uploadimg/:pid',[verifyAccessToken, isAdmin],uploadImg.array('images', 10),ctrls.uploadImageProduct);

router.put('/:pid', [verifyAccessToken, isAdmin], ctrls.updateProduct);
router.delete('/:pid', [verifyAccessToken, isAdmin], ctrls.deleteProduct);
router.get('/:pid', ctrls.getProduct);

module.exports = router;
