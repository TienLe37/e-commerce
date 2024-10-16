const router = require('express').Router();
const ctrls = require('../controllers/blog');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');
const uploadImg = require('../config/cloudinary.config');

router.post('/', [verifyAccessToken, isAdmin], ctrls.createNewBlog);
router.get('/', ctrls.getBlogs);
router.get('/one/:blogid', ctrls.getBlog);
router.put('/like/:blogid', verifyAccessToken, ctrls.likeBlog);
router.put('/dislike/:blogid', verifyAccessToken, ctrls.dislikeBlog);
router.put('/uploadimg/:blogid',[verifyAccessToken, isAdmin],uploadImg.single('image'),ctrls.uploadImageBlog);

router.put('/:blogid', [verifyAccessToken, isAdmin], ctrls.updateBlog);
router.delete('/:blogid', [verifyAccessToken, isAdmin], ctrls.deleteBlog);
module.exports = router;
