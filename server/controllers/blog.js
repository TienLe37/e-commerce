const Blog = require('../models/blog');
const asyncHandler = require('express-async-handler');

const createNewBlog = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;
  if (!title || !description || !category) throw new Error('Missing inputs');
  const response = await Blog.create(req.body);
  return res.json({
    success: response ? true : false,
    createBlog: response ? response : 'Cannot create new blog ',
  });
});
const getBlogs = asyncHandler(async (req, res) => {
  const response = await Blog.find();
  return res.json({
    success: response ? true : false,
    Blogs: response ? response : 'Cannot get blog ',
  });
});
const updateBlog = asyncHandler(async (req, res) => {
  const { blogid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error('Missing inputs');
  const response = await Blog.findByIdAndUpdate(blogid, req.body, {
    new: true,
  });
  return res.json({
    success: response ? true : false,
    updateBlog: response ? response : 'Cannot update blog ',
  });
});

// Like blog by user
/* 
   TH1. người dùng đã dislike bài viết ? => bỏ dislike
    TH2.người dùng đã like bài viết ?  => bỏ like / thêm like
*/
const likeBlog = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { blogid } = req.params;
  if (!blogid) throw new Error('Missing inputs');
  const blog = await Blog.findById(blogid);
  // Check user dislike blog hay chưa bằng cách tìm id user trong mảng dislikes
  const alreadyDisliked = blog?.dislikes?.find((el) => el.toString() === _id); // trả về true/false
  if (alreadyDisliked) {
    // nếu true : user đã dislike
    const response = await Blog.findByIdAndUpdate(
      blogid,
      { $pull: { dislikes: _id } }, // loại bỏ id của user ra khỏi mảng dislike
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      rs: response,
    });
  }
  // nếu chưa dislike : check xem user đã like trước đó chưa
  const isLiked = blog?.likes?.find((el) => el.toString() === _id);
  if (isLiked) {
    // đã like
    // nếu đã like trước đó : sau khi bấm like lần 2 sẽ bỏ like
    const response = await Blog.findByIdAndUpdate(
      blogid,
      { $pull: { likes: _id } }, // loại bỏ id của user ra khỏi mảng likes
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      rs: response,
    });
  } else {
    const response = await Blog.findByIdAndUpdate(
      blogid,
      { $push: { likes: _id } }, // thêm id của user vào mảng like
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      rs: response,
    });
  }
});

// Dislike :
/*
    TH1: nếu đã like bài viết ? => bỏ like thêm dislike
    Th2: nếu đã dislike bài viết ? => bỏ dislike/ thêm dislike
*/
const dislikeBlog = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { blogid } = req.params;
  if (!blogid) throw new Error('Missing inputs');
  const blog = await Blog.findById(blogid);
  // Check user like blog hay chưa bằng cách tìm id user trong mảng likes
  const alreadyLiked = blog?.likes?.find((el) => el.toString() === _id); // trả về true/false
  if (alreadyLiked) {
    // nếu true : user đã like
    const response = await Blog.findByIdAndUpdate(
      blogid,
      { $pull: { likes: _id } }, // loại bỏ id của user ra khỏi mảng likes
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      rs: response,
    });
  }
  // nếu chưa like : check xem user đã dislike trước đó chưa
  const isdisLiked = blog?.dislikes?.find((el) => el.toString() === _id);
  if (isdisLiked) {
    // đã dislike
    // nếu đã dislike trước đó : sau khi bấm dislike lần 2 sẽ bỏ dislike
    const response = await Blog.findByIdAndUpdate(
      blogid,
      { $pull: { dislikes: _id } }, // loại bỏ id của user ra khỏi mảng dislikes
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      rs: response,
    });
  } else {
    const response = await Blog.findByIdAndUpdate(
      blogid,
      { $push: { dislikes: _id } }, // thêm id của user vào mảng dislikes
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      rs: response,
    });
  }
});
// lấy ra bài blog với số views , danh sách user like , dislike
const getBlog = asyncHandler(async (req, res) => {
  const { blogid } = req.params;
  const blog = await Blog.findByIdAndUpdate(
    blogid,
    { $inc: { numberViews: 1 } },
    { new: true }
  )
    .populate('likes', 'firstname lastname')
    .populate('dislikes', 'firstname lastname');

  return res.json({
    success: blog ? true : false,
    Blogs: blog ? blog : 'Cannot get blog ',
  });
});
const deleteBlog = asyncHandler(async (req, res) => {
  const { blogid } = req.params;
  const response = await Blog.findByIdAndDelete(blogid);
  return res.json({
    success: response ? true : false,
    deleteBlog: response ? response : 'Cannot delete brand',
  });
});
const uploadImageBlog = asyncHandler(async (req, res) => {
  const { blogid } = req.params;
  if (!req.file) throw new Error('Missing images');
  const response = await Blog.findByIdAndUpdate(blogid,{ image: req.file.path  },{ new: true });
  return res.status(200).json({
    status: response ? true : false,
    updateBlog: response ? response : 'Cannot upload image',
  });
});
module.exports = {
  createNewBlog,
  getBlogs,
  updateBlog,
  likeBlog,
  dislikeBlog,
  getBlog,
  deleteBlog,
  uploadImageBlog
};
