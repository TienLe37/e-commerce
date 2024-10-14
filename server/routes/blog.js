const router = require('express').Router();
const ctrls = require('../controllers/blog');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

router.get('/', ctrls.getBlogs);
router.get('/one/:blogid', ctrls.getBlog);
router.post('/', [verifyAccessToken, isAdmin], ctrls.createNewBlog);
router.put('/like/:blogid', verifyAccessToken, ctrls.likeBlog);
router.put('/dislike/:blogid', verifyAccessToken, ctrls.dislikeBlog);
router.put('/:blogid', [verifyAccessToken, isAdmin], ctrls.updateBlog);

module.exports = router;
