import React, { useState, useEffect, useCallback } from 'react';
import { createSearchParams, useParams } from 'react-router-dom';
import { apiGetProduct, apiGetProducts } from 'apis/product';
import {
  Breadcrumb,
  Button,
  CustomSlider,
  ProductExtraItem,
  ProductInfomation,
  SelectQuantity,
} from 'components';
import Slider from 'react-slick';
import { formatMoney, formatPrice, renderStar } from 'utils/helpers';
import { productExtraInfo } from 'utils/contants';
import DOMPurify from 'dompurify';
import clsx from 'clsx';
import { apiUpdateCart } from 'apis';
import path from 'utils/path';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import withBaseComponent from 'hocs/withBaseComponent';
import { getCurrent } from 'store/user/asyncActions';
const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
};
const DetailProduct = ({navigate , dispatch, location}) => {
  const { current } = useSelector((state) => state.user);
  const { pid, category } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [varriantId, setVarriantId] = useState(null)
  const [varriantProduct, setVarriantProduct] = useState({
    title: '',
    price: '',
    color: '',
    thumb: '',
    images: [],
  })
  const fetchProductData = async () => {
    const response = await apiGetProduct(pid);
    if (response.success) setProduct(response.productData);
  };
  const fetchProducts = async () => {
    const response = await apiGetProducts({ category });
    if (response.success) setRelatedProducts(response.products);
  };
  useEffect(() => {
    if (pid) {
      fetchProductData();
      fetchProducts();
    }
    window.scrollTo(0, 0);
  }, [pid]);
  useEffect(() => {
    if(varriantId ) {
      setVarriantProduct({
        title : product?.varriants?.find(el => el.sku === varriantId)?.title,
        color : product?.varriants?.find(el => el.sku === varriantId)?.color,
        price : product?.varriants?.find(el => el.sku === varriantId)?.price,
        images : product?.varriants?.find(el => el.sku === varriantId)?.images,
        thumb : product?.varriants?.find(el => el.sku === varriantId)?.thumb,
      })
    } else {
      setVarriantProduct({
        title: product?.title,
        price: product?.price,
        color: product?.color,
        thumb: product?.thumb,
        images: product?.images || [],
      })
    }
  }, [varriantId])
  // Rerender trang detail product và update ratings ngay sau khi Submit Vote& Review
  const [update, setUpdate] = useState(false);
  const reRenderAfterVote = useCallback(() => {
    setUpdate(!update);
  }, [update]);
  useEffect(() => {
    if (pid) fetchProductData();
  }, [update]);
  //------------------------------
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
  const handleAddToCart = async() => {
    if(!current) {
      return Swal.fire({
        title: 'Almost...',
        text: 'Please login first! ?',
        showCancelButton: true,
        cancelButtonText: 'Not now!',  
        confirmButtonText: 'Go Login'
      }).then(async (rs) => {
        if(rs.isConfirmed) navigate({
          pathname: `/${path.LOGIN}`,
          search: createSearchParams({redirect: location.pathname}).toString()
        })
      })
    }
    const response = await apiUpdateCart({pid, 
      color: varriantProduct?.color || product?.color , 
      quantity , 
      price: varriantProduct?.price || product?.price ,
      thumb: varriantProduct?.thumb || product?.thumb ,
      title: varriantProduct?.title || product?.title,
    })
    if(response.success) {
      toast.success(response.mes)
      dispatch(getCurrent())
    } else toast.error(response.mes)
  }
  
  return (
    <div className='w-main'>
      <div className='w-full bg-gray-100 mt-[-24px] py-[15px] px-[5px]'>
        <h3 className='pb-2 font-semibold '>{varriantProduct?.title || product?.title}</h3>
        <Breadcrumb title={varriantProduct?.title || product?.title} category={product?.category} />
      </div>
      <div className='w-full flex mt-4'>
        <div className='flex flex-col gap-4 w-2/5'>
          <img
            src={varriantProduct?.thumb || product?.thumb}
            alt='product'
            className='h-[458px] w-[458px]  object-contain'
          />

          <div className='w-458px'>
            <Slider {...settings} className='image-slider'>
              {varriantProduct?.images?.length === 0 && product?.images?.map((el, index) => (
                <div key={index} className='px-2'>
                  <img
                    src={el}
                    alt='sub-img'
                    className='h-[143px] w-[143px] border object-contain'
                  ></img>
                </div>
              ))}
              { varriantProduct?.images.length > 0 && varriantProduct?.images?.map((el, index) => (
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
              formatPrice(varriantProduct?.price || product?.price)
            )} VNĐ`}</h2>
            <span className='text-sm text-main'>{`In Stock: ${product?.quantity}`}</span>
          </div>
          <div className='flex items-center gap-1'>
            {renderStar(product?.totalRatings, 14)?.map((el, index) => (
              <span key={index}>{el}</span>
            ))}
            <span className='text-sm text-main italic'>{` (Sold : ${product?.sold} )`}</span>
          </div>
          <ul className=' list-square text-sm text-gray-500  pl-4'>
            {product?.description?.length > 1 && product?.description?.map((el, index) => (
              <li className='leading-6' key={index}>
                {el}
              </li>
            ))}
            {product?.description?.length === 1 &&
              <div className='text-gray-500 text-sm' dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(product?.description[0])}}></div>
            }
          </ul>
          <div className='my-4 flex gap-4'>
              <span className='text-sm mr-3'>Color:</span>
              <div className='flex flex-wrap gap-4 items-center w-full'>
                  <div onClick={() => setVarriantId(null)}
                    className={clsx('flex items-center gap-2 p-2 border cursor-pointer', !varriantId && 'border-red-600')}
                    >
                    <img src={product?.thumb} alt='thumb' className='w-8 h-8 rounded-md object-cover'/>
                    <span>{product?.color}</span>
                  </div>
                  {product?.varriants?.map(el => (
                      <div key={el.sku}
                       onClick={() => setVarriantId(el.sku)}
                      className={clsx('flex items-center gap-2 p-2 border cursor-pointer', varriantId === el.sku && 'border-red-600')}>
                      <img src={el.thumb} alt='thumb' className='w-8 h-8 rounded-md object-cover'/>
                      <span>{el.color}</span>
                    </div>
                  ))}
              </div>
          </div>
          <div className='flex flex-col gap-4 '>
            <div className='flex items-center'>
              <h4 className=' text-sm mr-3'> Quantity</h4>
              <SelectQuantity
                quantity={quantity}
                handleQuantity={handleQuantity}
                handleChangeQuantity={handleChangeQuantity}
              />
            </div>
            <Button 
             handleOnClick={handleAddToCart}
             fw
             >ADD TO CART</Button>
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
      <div className='w-full mt-8'>
        <ProductInfomation
          totalRatings={product?.totalRatings}
          ratings={product?.ratings}
          nameProduct={product?.title}
          pid={product?._id}
          reRenderAfterVote={reRenderAfterVote}
        />
      </div>
      <div className='w-full mt-4'>
        <h3 className='text-[20px]  font-semibold py-[20px] border-b-2 border-main uppercase  '>
          {`OTHER PRODUCTS OF ${product?.category.toUpperCase()}`}
        </h3>
        <CustomSlider products={relatedProducts} normal={true} />
      </div>
      <div className='w-full h-[100px]'></div>
    </div>
  );
};

export default withBaseComponent(DetailProduct);
