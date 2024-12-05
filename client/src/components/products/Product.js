import React, { memo, useState } from 'react';
import cmsoon from 'assets/cmsoon.jpg';
import hotlabel from 'assets/hotlabel.png';
import newLabel from 'assets/newLabel.png';
import { formatMoney, renderStar } from 'utils/helpers';
import icons from 'utils/icons';
import { SelectOption } from 'components';
import { BiSolidCartAdd } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import { apiUpdateCart } from 'apis';
import { toast } from 'react-toastify';
import withBaseComponent from 'hocs/withBaseComponent';
import { getCurrent } from 'store/user/asyncActions';
import Swal from 'sweetalert2';
import path from 'utils/path';
import { BsFillCartCheckFill } from 'react-icons/bs';
const { BsFillSuitHeartFill } = icons;
function Product({ productData, isNew, normal , navigate , dispatch }) {
  const [isShowOption, setisShowOption] = useState(false);
  const { current } = useSelector((state) => state.user);

  const handleAddProduct = async (e , flag) => {
    e.stopPropagation()
    if(flag === 'WISHLIST') console.log('wishlist');
    if(flag === 'CART') {
        if(!current) {
          return Swal.fire({
            title: 'Almost...',
            text: 'Please login first! ?',
            showCancelButton: true,
            cancelButtonText: 'Not now!',  
            confirmButtonText: 'Go Login'
          }).then(async (rs) => {
            if(rs.isConfirmed) navigate(`/${path.LOGIN}`)
          })
        }
        const response = await apiUpdateCart({
          pid: productData._id , 
          color: productData.color, 
          thumb: productData?.thumb,
          images: productData?.images,
          title: productData?.title,
          price: productData?.price,
        })
        if(response.success) {
          toast.success(response.mes)
          dispatch(getCurrent())
        }
    }
  }
  return (
    <div className='w-full text-base px-[10px]'>
      <div
        onClick={e => navigate(`/${productData?.category?.toLowerCase()}/${productData?._id}/${productData?.title}`)}
        className='w-full border p-[15px] flex flex-col items-center cursor-pointer'
        onMouseEnter={(e) => {
          e.stopPropagation();
          setisShowOption(true);
        }}
        onMouseLeave={(e) => {
          e.stopPropagation();
          setisShowOption(false);
        }}
      >
        <div className=' w-full relative'>
          {isShowOption && (
            <div 
            className=' absolute bottom-0 left-0 right-0 flex justify-center gap-4 animate-slide-top '>
              <span title='Add to wishlist' onClick={ (e) => handleAddProduct(e, 'WISHLIST')}><SelectOption icons={<BsFillSuitHeartFill size={20} />} /> </span>
              {current?.cart?.some(el => el.product._id === productData._id) 
              ? <span title='Added to cart' ><SelectOption icons={<BsFillCartCheckFill size={25} color='green' />} /> </span>
              : <span title='Add to cart' onClick={ (e) => handleAddProduct(e, 'CART')}><SelectOption icons={<BiSolidCartAdd size={30} />} /> </span>
              }
            </div>
          )}
          <img
            src={productData?.thumb || cmsoon}
            alt=''
            className='min-w-[243px] max-h-[243px] object-contain'
          />
          {!normal && (
            <img
              src={isNew ? newLabel : hotlabel}
              alt=''
              className=' absolute top-[-15px] right-[-15px] w-[50px] h-[50px] object-contain '
            />
          )}
        </div>
        <div className='  flex flex-col  mt-[15px] items-start gap-1 w-full'>
          <span className='flex h-4'>
            {renderStar(productData?.totalRatings)?.map((el, index) => (
              <span key={index}>{el}</span>
            ))}
          </span>
          <span className='line-clamp-1'>{productData?.title}</span>
          <span>{`${formatMoney(productData.price)} VNĐ`}</span>
        </div>
      </div>
    </div>
  );
}

export default withBaseComponent(memo(Product));
