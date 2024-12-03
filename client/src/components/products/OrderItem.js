import React, { memo , useState } from 'react'
import SelectQuantity from 'components/common/SelectQuantity';
import { formatMoney } from 'utils/helpers'

const OrderItem = ({el}) => {
    const [quantity, setQuantity] = useState(1);
    const handleQuantity = (number) => {
      if(+number > 1) setQuantity(number)
    }
    
    const handleChangeQuantity = (flag) => {
        if (flag === '-' && quantity === 1) return;
        if (flag === '-') setQuantity((pre) => +pre - 1);
        if (flag === '+') setQuantity((pre) => +pre + 1);
      }
  return (
    <div className='w-full border mx-auto font-bold py-3 grid grid-cols-10'>
          <span className='col-span-5 w-full '>
            <div className='flex gap-2'>
              <img src={el.thumb} alt='thumb' className='w-20 h-20 object-cover' />
              <div className='flex flex-col justify-center  gap-1'>
                <span className='text-sm font-semibold'>{el.title}</span>
                <span className='text-xs font-normal'>{`Color: ${el.color}`}</span>
              </div>
            </div>
          </span>
          <span className='col-span-2 w-full text-center'>
            <div className='flex items-center justify-center h-full font-normal'>
              <SelectQuantity
                quantity={quantity}
                handleQuantity={handleQuantity}
                handleChangeQuantity={handleChangeQuantity}
              />
            </div>
          </span>
          <span className='col-span-3 w-full text-center h-full flex items-center justify-center'>
            <span className='text-sm font-normal '>{`${formatMoney(el.price)} VNĐ`}</span>
          </span>
        </div>
  )
}

export default memo(OrderItem)