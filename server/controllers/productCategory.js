const productCategory = require('../models/productCategory');
const asyncHandler = require('express-async-handler');

const createCategory = asyncHandler(async (req, res) => {
  const response = await productCategory.create(req.body);
  return res.json({
    success: response ? true : false,
    createCate: response ? response : 'Cannot create product category',
  });
});
const getCategories = asyncHandler(async (req, res) => {
  const response = await productCategory.find();
  return res.json({
    success: response ? true : false,
    Categories: response ? response : 'Cannot get product category',
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { pcid } = req.params;
  const response = await productCategory.findByIdAndUpdate(pcid, req.body, {
    new: true,
  });
  return res.json({
    success: response ? true : false,
    updateCate: response ? response : 'Cannot update product category',
  });
});
const deleteCategory = asyncHandler(async (req, res) => {
  const { pcid } = req.params;
  const response = await productCategory.findByIdAndDelete(pcid);
  return res.json({
    success: response ? true : false,
    deleteCate: response ? response : 'Cannot delete product category',
  });
});

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
