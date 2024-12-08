import { Breadcrumb, Button, OrderItem, Paypal } from 'components'
import withBaseComponent from 'hocs/withBaseComponent'
import React, { memo  } from 'react'
import { useSelector } from 'react-redux'
import { createSearchParams, Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import { formatMoney } from 'utils/helpers'
import path from 'utils/path'

const DetailCart = ({location,dispatch,navigate}) => {
  const { currentCart, current } = useSelector(state => state.user)
  const handleSubmit = () => {
    if(!current?.address) return  Swal.fire({
      icon: 'info',
      title: 'Almost!',
      text: 'Please update your address before checkout!!!',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Update address',
    }).then((rs) => {
      if (rs.isConfirmed) {
        navigate({
          pathname: `/${path.MEMBER}/${path.PERSONAL}`,
          search: createSearchParams({redirect: location.pathname}).toString()
        })
      }
    });
    else window.open(`/${path.CHECK_OUT}`, '_blank')
  }
  return (
    <div className='w-main mb-10'>
        <div className='w-full  bg-gray-100 mt-[-24px] py-[15px] px-[5px]'>
          <h3 className='font-semibold'>My Shopping Cart</h3>
          <Breadcrumb category={location?.pathname?.replace('/','')?.split('-').join(' ')}/>
        </div>
        <div className='w-full mt-[25px] mx-auto border font-bold py-3 grid grid-cols-10'>
          <span className='col-span-3 w-full text-sm font-semibold text-[#5b5858] text-center'>Product</span>
          <span className='col-span-3 w-full text-sm font-medium text-[#888888] text-center'>Unit Price</span>
          <span className='col-span-1 w-full text-sm font-medium text-[#888888] text-center '>Quantity</span>
          <span className='col-span-3 w-full text-sm font-medium text-[#888888] text-center '>Total Price</span>
        </div>
        {currentCart?.map(el => (
          <OrderItem 
            key={el._id} 
            el={el}
            defaultQuantity={el.quantity}
          />
        ))}
        <div className='w-full mx-auto  flex flex-col mb-12 mt-12 justify-center items-end gap-3'>
          <span className='flex items-center gap-6 '>
            <span className='text-[18px] font-semibold text-main'>Subtotal: </span>
            <span className=''>{formatMoney(currentCart?.reduce((sum , el) => sum + Number(el?.price) * el?.quantity ,0)) + ' VNĐ'} </span>
          </span>
          <span className='text-center text-gray-700 italic text-xs'>Shipping, taxes, and discounts calculate at checkout.</span>
          <Button handleOnClick={handleSubmit}>Checkout</Button>
        </div>
    </div>

  )
}

export default withBaseComponent(memo(DetailCart))