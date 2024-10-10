const Product = require('../models/product');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');

const createProduct = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) throw new Error('Missing inputs');
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const newProduct = await Product.create(req.body);
  return res.status(200).json({
    success: newProduct ? true : false,
    createdProduct: newProduct ? newProduct : 'Cannot create new product',
  });
});
//Lấy một sản phẩm
const getProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const product = await Product.findById(pid);
  return res.status(200).json({
    success: product ? true : false,
    productData: product ? product : 'Cannot get product',
  });
});
//Lấy nhiều sản phẩm
// Filtering, sorting & pagination
const getProducts = asyncHandler(async (req, res) => {
  // copy queries mới
  const queries = { ...req.query };
  // Tách các trường đặc biệt ra khỏi query
  const excludeFields = ['limit', 'sort', 'page', 'fields'];
  excludeFields.forEach((el) => delete queries[el]);
  // Chuyển queries từ dạng mảng Object sang string
  let queryString = JSON.stringify(queries);
  // replace để thêm dâu $trước các từ đặc biệt gte|gt|lte|lt => $gte|$gt|$lte|$lt để mongo hiểu
  queryString = queryString.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`
  );
  // format lại queries từ dạng string
  const formatedQueries = JSON.parse(queryString);
  // Filtering
  if (queries?.title)
    formatedQueries.title = { $regex: queries.title, $options: 'i' };
  // tạo promise dạng pending(không có await) để khi tìm kiếm sẽ chờ người dùng nhập thêm thông tin tìm kiếm
  let queryCommand = Product.find(formatedQueries);

  //Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    queryCommand = queryCommand.sort(sortBy);
  }

  // thực thi hàm queryCommand
  queryCommand
    .then(async (response) => {
      const counts = await Product.find(formatedQueries).countDocuments(); // counts: số lượng sản phẩm thỏa mãn điều kiện
      return res.status(200).json({
        success: counts > 0 ? true : false,
        products: counts > 0 ? response : 'Cannot get products',
        counts,
      });
    })
    .catch((err) => console.log(err));
});

const updateProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: updatedProduct ? true : false,
    updatedProduct: updatedProduct ? updatedProduct : 'Cannot update product',
  });
});
const deleteProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const deletedProduct = await Product.findByIdAndDelete(pid);
  return res.status(200).json({
    success: deletedProduct ? true : false,
    deletedProduct: deletedProduct
      ? deletedProduct
      : 'Not found product to delete',
  });
});

module.exports = {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
};
