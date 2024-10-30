const Product = require('../models/product');
const asyncHandler = require('express-async-handler');
const data = require('../../data/data.json');
const slugify = require('slugify');
const product = require('../models/product');
const categoryData = require('../../data/cate_brand');
const productCategory = require('../models/productCategory');
const fn = async (product) => {
  await Product.create({
    title: product?.name,
    slug: slugify(product?.name) + Math.round(Math.random() * 1000) + '',
    description: product?.description,
    brand: product?.brand,
    price: Math.round(Number(product?.price?.match(/\d/g).join('')) / 100),
    category: product?.category[1],
    quantity: Math.round(Math.random() * 1000),
    sold: Math.round(Math.random() * 100),
    images: product?.images,
    color: product?.variants?.find((el) => el.label === 'Color')?.variants[0],
    thumb: product?.thumb,
    totalRatings: Math.round(Math.random() * 4) + 1,
  });
};

const insertProduct = asyncHandler(async (req, res) => {
  const promises = [];
  for (let product of data) promises.push(fn(product));
  await Promise.all(promises);
  return res.json('Done');
});

const fn2 = async (dataCate) => {
  await productCategory.create({
    title: dataCate?.cate,
    brand: dataCate?.brand,
    image: dataCate?.image,
  });
};
const insertCategory = asyncHandler(async (req, res) => {
  const promises = [];
  for (let cate of categoryData) promises.push(fn2(cate));
  await Promise.all(promises);
  return res.json('Done');
});
module.exports = {
  insertProduct,
  insertCategory,
};
