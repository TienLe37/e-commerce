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
  /**  copy queries mới từ req.query: dùng destructering : queries va req.query trỏ tới 2 ô nhớ khác nhau
   chỉnh sửa queries không ảnh hưởng tới req.query **/
  const queries = { ...req.query };
  // Tách các trường đặc biệt ra khỏi query
  const excludeFields = ['limit', 'sort', 'page', 'fields'];
  excludeFields.forEach((el) => delete queries[el]);
  // Chuyển queries từ dạng mảng Object sang string
  let queryString = JSON.stringify(queries);
  // replace để thêm dâu $trước các từ đặc biệt gte|gt|lte|lt => $gte|$gt|$lte|$lt theo cú pháp moongo
  queryString = queryString.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`
  );
  // format lại queries từ dạng string
  const formatedQueries = JSON.parse(queryString);
  let colorQueriesObject = {};
  // Filtering
  if (queries?.title)
    formatedQueries.title = { $regex: queries.title, $options: 'i' };
  if (queries?.category)
    formatedQueries.category = { $regex: queries.category, $options: 'i' };
  // Tìm kiếm cho nhiều color
  if (queries?.color) {
    delete formatedQueries.color; // xóa color trong formatedQueries
    const colorArray = queries?.color?.split(','); // split color: Black, gray -> [Black, gray]
    const colorQueries = colorArray.map((el) => ({
      color: { $regex: el, $options: 'i' },
    }));
    colorQueriesObject = { $or: colorQueries };
  }
  const q = { ...colorQueriesObject, ...formatedQueries };
  // tạo promise dạng pending(không có await) để khi tìm kiếm sẽ chờ người dùng nhập thêm thông tin tìm kiếm
  let queryCommand = Product.find(q);

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
  const limit = +req.query.limit || process.env.LIMIT_PRODUCT;
  const page = +req.query.page || 1;
  const skip = (page - 1) * limit;
  queryCommand = queryCommand.skip(skip).limit(limit);
  // thực thi hàm queryCommand
  queryCommand
    .then(async (response) => {
      const counts = await Product.find(q).countDocuments(); // counts: số lượng sản phẩm thỏa mãn điều kiện
      return res.status(200).json({
        success: counts >= 0 ? true : false,
        counts,
        products: counts >= 0 ? response : 'Cannot get products',
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
// đánh giá sản phẩm
const ratings = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, comment, pid } = req.body;
  if (!_id || !pid) throw new Error('Missing inputs');
  // tìm kiếm sản phẩm cần đánh giá bằng pid
  const ratingProduct = await Product.findById(pid);
  // xem user đã đánh giá sản phẩm hay chưa
  const alreadyRating = ratingProduct?.ratings?.find(
    (el) => el.postedBy.toString() === _id
  );
  if (alreadyRating) {
    // nếu đã đánh giá rồi
    await Product.updateOne(
      // tìm trường ratings trong Product
      {
        ratings: { $elemMatch: alreadyRating }, // nếu alreadyRating đã match với 1 trường ratings
      },
      {
        $set: { 'ratings.$.star': star, 'ratings.$.comment': comment }, // set: cập nhật lại star comment
      },
      { new: true }
    );
  } else {
    // nếu chưa đánh giá
    await Product.findByIdAndUpdate(
      // tìm pid
      pid,
      {
        $push: { ratings: { star, comment, postedBy: _id } }, // đẩy star commnet vào ratings
      },
      { new: true }
    );
  }
  // totalRating
  const updateProduct = await Product.findById(pid);
  const ratingsLength = updateProduct.ratings.length;
  const sumRatings = updateProduct.ratings.reduce(
    (sum, el) => sum + +el.star,
    0
  );
  updateProduct.totalRatings =
    Math.round((sumRatings * 10) / ratingsLength) / 10;
  await updateProduct.save();
  return res.status(200).json({
    status: true,
    updateProduct,
  });
});
const uploadImageProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  if (!req.files) throw new Error('Missing images');
  const response = await Product.findByIdAndUpdate(
    pid,
    { $push: { images: { $each: req.files.map((el) => el.path) } } },
    { new: true }
  );
  return res.status(200).json({
    status: response ? true : false,
    updateProduct: response ? response : 'Cannot upload images',
  });
});
module.exports = {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  ratings,
  uploadImageProduct,
};
