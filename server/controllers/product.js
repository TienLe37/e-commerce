const Product = require('../models/product');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');

const createProduct = asyncHandler(async (req, res) => {
  const {title, price,description, brand, category, color } = req.body
  if(!(title && price &&description && category && color)) throw new Error('Missing inputs');
  req.body.slug = slugify(title);
  const thumb = req.files?.thumb[0]?.path
  const images = req.files?.images?.map(el => el.path )
  if(thumb) req.body.thumb = thumb
  if(images) req.body.images = images
  const newProduct = await Product.create(req.body);
  return res.status(200).json({
    success: newProduct ? true : false,
    mes: newProduct ? 'Create product success' : 'Cannot create new product',
  });
});
//Lấy một sản phẩm
const getProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const product = await Product.findById(pid).populate({
    path: 'ratings',
    populate: {
      path: 'postedBy',
      select: 'firstname lastname avatar',
    },
  });
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
  // Filtering
  if (queries?.title)
    formatedQueries.title = { $regex: queries.title, $options: 'i' };
  if (queries?.category)
    formatedQueries.category = { $regex: queries.category, $options: 'i' };
  // Tìm kiếm cho nhiều color
  let colorQueriesObject = {};
  if (queries?.color) {
    delete formatedQueries.color; // xóa color trong formatedQueries
    const colorArray = queries?.color?.split(','); // split color: Black, gray -> [Black, gray]
    const colorQueries = colorArray.map((el) => ({
      color: { $regex: el, $options: 'i' },
    }));
    colorQueriesObject = { $or: colorQueries };
  }
  let queryObject = {}
  if(queries?.q) {
    delete formatedQueries.q
    queryObject = {
      $or: [
      {color: { $regex: queries.q, $options: 'i' }},
      {title: { $regex: queries.q, $options: 'i' }},
      {category: { $regex: queries.q, $options: 'i' }},
      { brand: { $regex: queries.q, $options: 'i' }},
      ]
    }
  }
  const finalQuery = { ...colorQueriesObject, ...formatedQueries, ...queryObject };
  // tạo promise dạng pending(không có await) để khi tìm kiếm sẽ chờ người dùng nhập thêm thông tin tìm kiếm
  let queryCommand = Product.find(finalQuery);

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
      const counts = await Product.find(finalQuery).countDocuments(); // counts: số lượng sản phẩm thỏa mãn điều kiện
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
  if(req?.files?.thumb) req.body.thumb = req?.files?.thumb[0]?.path
  if(req?.files?.images) req.body.images = req.files?.images?.map(el => el.path )
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: updatedProduct ? true : false,
    mes: updatedProduct ? 'Update product success' : 'Cannot update product',
  });
});
const deleteProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const deletedProduct = await Product.findByIdAndDelete(pid);
  return res.status(200).json({
    success: deletedProduct ? true : false,
    mes: deletedProduct
      ? 'Deleted'
      : 'Not found product to delete',
  });
});
// đánh giá sản phẩm
const ratings = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, comment, pid, updatedAt } = req.body;
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
        $set: {
          'ratings.$.star': star,
          'ratings.$.comment': comment,
          'ratings.$.updatedAt': updatedAt,
        }, // set: cập nhật lại star comment
      },
      { new: true }
    );
  } else {
    // nếu chưa đánh giá
    await Product.findByIdAndUpdate(
      // tìm pid
      pid,
      {
        $push: { ratings: { star, comment, postedBy: _id, updatedAt } }, // đẩy star commnet vào ratings
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
