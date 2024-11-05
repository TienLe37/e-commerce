import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { apiGetProduct } from '../../apis/product';
import {
  Breadcrumb,
  Button,
  ProductExtraItem,
  SelectQuantity,
} from '../../components';
import Slider from 'react-slick';
import { formatMoney, formatPrice, renderStar } from '../../utils/helpers';
import { productExtraInfo } from '../../utils/contants';
import icons from '../../utils/icons';

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
};
const DetailProduct = () => {
  const { pid, title } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const fetchProductData = async () => {
    const response = await apiGetProduct(pid);
    if (response.success) setProduct(response.productData);
  };
  useEffect(() => {
    if (pid) fetchProductData();
  }, [pid]);
  const handleQuantity = useCallback(
    (number) => {
      console.log(number);
      if (!Number(number) || Number(number) < 1) {
        return;
      } else {
        setQuantity(number);
      }
    },
    [quantity]
  );
  const handleChangeQuantity = useCallback(
    (flag) => {
      if (flag === '-' && quantity === 1) return;
      if (flag === '-') setQuantity((pre) => +pre - 1);
      if (flag === '+') setQuantity((pre) => +pre + 1);
    },
    [quantity]
  );
  return (
    <div className='w-main'>
      <div className='w-full bg-gray-100 mt-[-24px] py-[15px] px-[5px]'>
        <h3 className='pb-2 font-semibold '>{title}</h3>
        <Breadcrumb title={title} category={product?.category} />
      </div>
      <div className='w-full flex mt-4'>
        <div className='flex flex-col gap-4 w-2/5'>
          <img
            src={product?.images}
            alt='product'
            className='h-[458px] w-[458px]  object-cover'
          />

          <div className='w-458px'>
            <Slider {...settings} className='image-slider'>
              {product?.images?.map((el, index) => (
                <div key={index} className='px-2'>
                  <img
                    src={el}
                    alt='sub-img'
                    className='h-[143px] w-[143px] border object-contain'
                  ></img>
                </div>
              ))}
            </Slider>
          </div>
        </div>
        <div className='w-2/5 px-[30px] flex flex-col gap-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-[30px] font-semibold '>{`${formatMoney(
              formatPrice(product?.price)
            )} VNĐ`}</h2>
            <span className='text-sm text-main'>{`Kho: ${product?.quantity}`}</span>
          </div>
          <div className='flex items-center gap-1'>
            {renderStar(product?.totalRatings, 14)?.map((el, index) => (
              <span key={index}>{el}</span>
            ))}
            <span className='text-sm text-main italic'>{` (Đã bán : ${product?.sold} cái)`}</span>
          </div>
          <ul className=' list-square text-sm text-gray-500  pl-4'>
            {product?.description?.map((el, index) => (
              <li className='leading-6' key={index}>
                {el}
              </li>
            ))}
          </ul>
          <div className='flex flex-col gap-4 '>
            <div className='flex items-center'>
              <h4 className=' text-sm mr-3'> Quantity</h4>
              <SelectQuantity
                quantity={quantity}
                handleQuantity={handleQuantity}
                handleChangeQuantity={handleChangeQuantity}
              />
            </div>
            <Button fw>ADD TO CART</Button>
          </div>
        </div>
        <div className='w-1/5'>
          {productExtraInfo.map((el) => (
            <ProductExtraItem
              key={el.id}
              icon={el.icon}
              title={el.title}
              sub={el.sub}
            />
          ))}
        </div>
      </div>
      <div className='w-full h-[100px]'></div>
    </div>
  );
};

export default DetailProduct;
