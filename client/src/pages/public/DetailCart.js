import { Breadcrumb, Button, OrderItem, SelectQuantity } from 'components'
import withBaseComponent from 'hocs/withBaseComponent'
import React, { memo , useState } from 'react'
import { useSelector } from 'react-redux'
import { formatMoney } from 'utils/helpers'

const DetailCart = ({location}) => {
  const { current } = useSelector(state => state.user)
 
  return (
    <div className='w-main mb-10'>
        <div className='w-full  bg-gray-100 mt-[-24px] py-[15px] px-[5px]'>
          <h3 className='font-semibold'>My Cart</h3>
          <Breadcrumb category={location?.pathname}/>
        </div>
        <div className='w-full mt-[25px] mx-auto border font-bold py-3 grid grid-cols-10'>
          <span className='col-span-5 w-full '></span>
          <span className='col-span-2 w-full font-semibold text-center '>Quantity</span>
          <span className='col-span-3 w-full font-semibold text-center'>Price</span>
        </div>
        {current?.cart?.map(el => (
          <OrderItem key={el._id} el={el}/>
        ))}
        <div className='w-full mx-auto flex flex-col mb-12 mt-12 justify-center items-end gap-3'>
          <span className='flex items-center gap-8 '>
            <span className='text-[18px] font-semibold'>Total bill: </span>
            <span className=''>{formatMoney(current?.cart?.reduce((sum , el) => sum + Number(el?.price),0)) + ' VNĐ'} </span>
          </span>
          <span className='text-center text-gray-700 italic text-xs'>Shipping, taxes, and discounts calculate at checkout.</span>
          <span></span>
          <Button>Checkout</Button>
        </div>
    </div>

  )
}

export default withBaseComponent(memo(DetailCart))