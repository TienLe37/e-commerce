import React, { memo , useState , useEffect } from 'react'
import SelectQuantity from 'components/common/SelectQuantity';
import { formatMoney } from 'utils/helpers'
import withBaseComponent from 'hocs/withBaseComponent';
import { updateCart } from 'store/user/userSlice';

const OrderItem = ({el, dispatch, defaultQuantity = 1 }) => {
    const [quantity, setQuantity] = useState(defaultQuantity);
    const handleQuantity = (number) => {
      if(+number > 1) setQuantity(number)
    }
    const handleChangeQuantity = (flag) => {
        if (flag === '-' && quantity === 1) return;
        if (flag === '-') setQuantity((pre) => +pre - 1);
        if (flag === '+') setQuantity((pre) => +pre + 1);
      }
    useEffect(() => {
        dispatch(updateCart({pid: el.product?._id, quantity, color : el.color}))
    }, [quantity])
    
  return (
    <div className='w-full border mx-auto font-bold py-3 grid grid-cols-10'>
          <span className='col-span-3 w-full '>
            <div className='flex gap-2'>
              <img src={el.thumb} alt='thumb' className='w-[120px] h-[120px] object-cover' />
              <div className='flex flex-col justify-center  gap-1'>
                <span className='text-sm font-semibold'>{el.title}</span>
                <span className='text-xs font-normal'>{`Color: ${el.color}`}</span>
              </div>
            </div>
          </span>
          <span className='col-span-3 w-full text-center h-full flex items-center justify-center'>
            <span className='text-sm font-normal '>{`${formatMoney(el.price)} VNĐ`}</span>
          </span>
          <span className='col-span-1 w-full text-center'>
            <div className='flex items-center justify-center h-full font-normal'>
              <SelectQuantity
                quantity={quantity}
                handleQuantity={handleQuantity}
                handleChangeQuantity={handleChangeQuantity}
              />
            </div>
          </span>
          <span className='col-span-3 w-full text-center h-full flex items-center justify-center'>
            <span className='text-sm font-normal text-main'>{`${formatMoney(el.price * quantity)} VNĐ`}</span>
          </span>
        </div>
  )
}

export default withBaseComponent(memo(OrderItem))