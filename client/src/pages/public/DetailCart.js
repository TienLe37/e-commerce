import { Breadcrumb, SelectQuantity } from 'components'
import withBaseComponent from 'hocs/withBaseComponent'
import React, { memo , useState } from 'react'
import { useSelector } from 'react-redux'
import { formatMoney } from 'utils/helpers'

const DetailCart = ({location}) => {
  const { current } = useSelector(state => state.user)
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
    <div className='w-main mb-10'>
        <div className='w-full  bg-gray-100 mt-[-24px] py-[15px] px-[5px]'>
          <h3>My Cart</h3>
          <Breadcrumb category={location?.pathname}/>
        </div>
        <div className='w-full mt-[25px] mx-auto border font-bold py-3 grid grid-cols-10'>
          <span className='col-span-5 w-full '></span>
          <span className='col-span-2 w-full font-semibold text-center '>Quantity</span>
          <span className='col-span-3 w-full font-semibold text-center'>Price</span>
        </div>
        {current?.cart?.map(el => (
        <div key={el._id} className='w-full border mx-auto font-bold py-3 grid grid-cols-10'>
          <span className='col-span-5 w-full '>
            <div className='flex gap-2'>
              <img src={el.product?.thumb} alt='thumb' className='w-20 h-20 object-cover' />
              <div className='flex flex-col justify-center  gap-1'>
                <span className='text-sm font-semibold'>{el.product?.title}</span>
                <span className='text-xs font-semibold'>{`Color: ${el.color}`}</span>
              </div>
            </div>
          </span>
          <span className='col-span-2 w-full text-center'>
            <div className='flex items-center justify-center h-full'>
              <SelectQuantity
                quantity={quantity}
                handleQuantity={handleQuantity}
                handleChangeQuantity={handleChangeQuantity}
              />
            </div>
          </span>
          <span className='col-span-3 w-full text-center h-full flex items-center justify-center'>
            <span className='text-sm font-normal '>{`${formatMoney(el.product?.price)} VNĐ`}</span>
          </span>
        </div>
        ))}
    </div>
  )
}

export default withBaseComponent(memo(DetailCart))