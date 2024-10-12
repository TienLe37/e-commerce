const blogCategory = require('../models/blogCategory');
const asyncHandler = require('express-async-handler');

const createCategory = asyncHandler(async (req, res) => {
  const response = await blogCategory.create(req.body);
  return res.json({
    success: response ? true : false,
    createCate: response ? response : 'Cannot create blog category',
  });
});
const getCategories = asyncHandler(async (req, res) => {
  const response = await blogCategory.find().select('title id');
  return res.json({
    success: response ? true : false,
    Categories: response ? response : 'Cannot get blog category',
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { bcid } = req.params;
  const response = await blogCategory.findByIdAndUpdate(bcid, req.body, {
    new: true,
  });
  return res.json({
    success: response ? true : false,
    updateCate: response ? response : 'Cannot update blog category',
  });
});
const deleteCategory = asyncHandler(async (req, res) => {
  const { bcid } = req.params;
  const response = await blogCategory.findByIdAndDelete(bcid);
  return res.json({
    success: response ? true : false,
    deleteCate: response ? response : 'Cannot delete blog category',
  });
});

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
