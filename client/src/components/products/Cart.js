import withBaseComponent from 'hocs/withBaseComponent'
import React, { memo } from 'react'
import { AiFillCloseCircle } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import { showCart } from 'store/app/appSlice'
import { formatMoney } from 'utils/helpers'
import { ImBin } from "react-icons/im";
import Button from 'components/buttons/Button'
import { apiRemoveCart } from 'apis'
import { toast } from 'react-toastify'
import { getCurrent } from 'store/user/asyncActions'
import path from 'utils/path'
const Cart = ({dispatch , navigate}) => {
  const { currentCart } = useSelector(state => state.user)
  const removeProductFromCart = async (pid , color) => {
    const response = await apiRemoveCart(pid, color)
    if(response.success) {
      toast.success(response.mes)
      dispatch(getCurrent())
    } else toast.error(response.mes)
  }
  return (
    <div 
    onClick={e => e.stopPropagation()}
    className='w-[360px] h-screen min-h-screen fixed  grid grid-rows-10 bg-[#e5e5e5] p-6 pt-2 '>
      <header className='border-b border-gray-500 flex justify-between items-center font-bold text-2xl row-span-1 h-full'>
        <span>Your cart</span>
        <span 
        onClick={() => dispatch(showCart())}
        className='p-2 cursor-pointer hover:text-main'
        > <AiFillCloseCircle size={25}/></span>
      </header>
      <section className='row-span-7 flex flex-col gap-3 h-full max-h-full overflow-y-auto py-3'>
          {currentCart?.length === 0 && <span className='text-sm pt-6'>Your cart is empty.</span>}
          {currentCart?.length > 0 && currentCart?.map(el => (
            <div key={el._id} className='flex justify-between items-center'>
              <div className='flex gap-3'>
                <img src={el.thumb} alt='thumb' className='w-16 h-16 object-cover' />
                <div className='flex flex-col gap-1'>
                  <span className='text-sm font-semibold'>{el.title}</span>
                  <span className='text-xs'>{`color: ${el.color}`}</span>
                  <span className='text-sm '>{`${el.quantity} x ${formatMoney(+el.price)} VNĐ`}</span>
                </div>
              </div>
              <span 
              onClick={() => removeProductFromCart(el.product?._id , el.color)}
              className='h-8 w-8 rounded-full flex items-center justify-center hover:text-main cursor-pointer'><ImBin size={15}/></span>
            </div>
          ))}
      </section>
      <div className='row-span-2 h-full flex flex-col justify-between'>
        <div className='flex items-center justify-between py-4 border-t border-t-black'>
          <span>Subtotal:</span>
          <span>{formatMoney(currentCart?.reduce((sum , el) => sum + Number(el?.price) * el.quantity,0)) + 'VNĐ'} </span>
        </div>
        <span className='text-center text-gray-700 italic text-xs'>Shipping, taxes, and discounts calculate at checkout.</span>
        <Button 
        handleOnClick={() => {
          dispatch(showCart())
          navigate(`${path.DETAIL_CART}`)
        }} 
          style='rounded-none w-full text-white bg-main my-2 hover:bg-red-700 py-3'
        >View My Shopping Cart</Button>
      </div>
    </div>
  )
}

export default withBaseComponent(memo(Cart))