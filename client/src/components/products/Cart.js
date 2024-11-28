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
  const { current } = useSelector(state => state.user)
  const removeProductFromCart = async (pid) => {
    const response = await apiRemoveCart(pid)
    if(response.success) {
      toast.success(response.mes)
      dispatch(getCurrent())
    } else toast.error(response.mes)
  }
  return (
    <div 
    onClick={e => e.stopPropagation()}
    className='w-[400px] h-screen min-h-screen fixed bg-black grid grid-rows-10 text-white p-6 pt-2 '>
      <header className='border-b border-gray-500 flex justify-between items-center font-bold text-2xl row-span-1 h-full'>
        <span>Your cart</span>
        <span 
        onClick={() => dispatch(showCart())}
        className='p-2 cursor-pointer hover:text-main'
        > <AiFillCloseCircle size={25}/></span>
      </header>
      <section className='row-span-7 flex flex-col gap-3 h-full max-h-full overflow-y-auto py-3'>
          {current?.cart.length === 0 && <span className='text-sm pt-6'>Your cart is empty.</span>}
          {current?.cart.length > 0 && current?.cart?.map(el => (
            <div key={el._id} className='flex justify-between items-center'>
              <div className='flex gap-2'>
                <img src={el.product?.thumb} alt='thumb' className='w-16 h-16 object-cover' />
                <div className='flex flex-col gap-1'>
                  <span className='text-sm font-semibold'>{el.product?.title}</span>
                  <span className='text-xs'>{`color: ${el.color}`}</span>
                  <span className='text-sm '>{`${formatMoney(el.product?.price)} VNĐ`}</span>
                </div>
              </div>
              <span 
              onClick={() => removeProductFromCart(el.product?._id)}
              className='h-8 w-8 rounded-full flex items-center justify-center hover:text-main cursor-pointer'><ImBin size={15}/></span>
            </div>
          ))}
      </section>
      <div className='row-span-2 h-full flex flex-col justify-between'>
        <div className='flex items-center justify-between pt-4 border-t'>
          <span>Total bill:</span>
          <span>{formatMoney(current?.cart?.reduce((sum , el) => sum + Number(el.product?.price),0)) + 'VNĐ'} </span>
        </div>
        <span className='text-center text-gray-700 italic text-xs'>Shipping, taxes, and discounts calculate at checkout.</span>
        <Button 
        handleOnClick={() => {
          dispatch(showCart())
          navigate(`${path.DETAIL_CART}`)
        }} 
          style='rounded-none w-full text-white bg-main my-2 hover:bg-red-700 py-3'
        >Shopping Cart</Button>
      </div>
    </div>
  )
}

export default withBaseComponent(memo(Cart))