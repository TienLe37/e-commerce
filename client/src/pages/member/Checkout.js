import React , {memo, useEffect, useState} from 'react'
import payment from 'assets/mobile-payment.png';
import { useSelector } from 'react-redux';
import { formatMoney } from 'utils/helpers';
import {  Congratulation, Paypal } from 'components';
import withBaseComponent from 'hocs/withBaseComponent';
import { getCurrent } from 'store/user/asyncActions';
import { IoLocationSharp } from 'react-icons/io5';
const Checkout = ({dispatch, navigate}) => {
  const {currentCart, current} = useSelector(state => state.user)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
 useEffect(() => {
   if(paymentSuccess) dispatch(getCurrent())
 }, [paymentSuccess])
 
  return (
    <div className=' grid grid-cols-10 h-full min-h-screen overflow-y-auto '>
      {paymentSuccess && <Congratulation/>}
      <div className='w-full flex justify-center items-center min-h-screen  bg-slate-700 col-span-4'>
          <img src={payment} alt='payment' className=' object-contain'  />
      </div>  
      <div className='w-full flex flex-col  items-center col-span-6 gap-3  bg-gray-200'>
        <h2 className='w-full justify-center text-3xl flex font-medium py-[20px]  border-b-black border-b-[3px] '>Checkout your order</h2>
        <table className='table-auto w-full'>
          <thead>
            <tr className='border bg-gray-200'>
              <th className='text-center p-2'>Product</th>
              <th className='text-center p-2'>Quantity</th>
              <th className='text-center p-2'>Price</th>
            </tr>
          </thead>
          <tbody>
            {currentCart?.map(el => (
              <tr className='border' key={el._id}>
                <td className='text-center p-2'>{el.title}</td>
                <td className='text-center p-2'>{el.quantity}</td>
                <td className='text-center p-2'>{formatMoney(+el.price) + ' VNĐ'  }</td>
              </tr>
            ))}
          </tbody>
        </table>
        <span className='w-full flex items-center justify-end gap-6 pr-[80px]'>
            <span className='text-[18px] font-semibold text-main'>Total: </span>
            <span className=''>{formatMoney(currentCart?.reduce((sum , el) => sum + Number(el?.price) * el?.quantity ,0)) + ' VNĐ'} </span>
        </span>
        <div>
        
        <span className='w-full flex items-center gap-6 pr-[80px]'>
          <span className='flex items-center justify-center'>
            <IoLocationSharp />
            <span className='text-normal font-base'>Address: </span>
          </span>
          <span className=''>{current?.address}</span>
        </span>
        <h2 className='w-full mt-[10px] flex font-medium '>Choose payment method:</h2>
        </div>
        
        <div className='w-full '>
          <Paypal 
            payload={{
            products: currentCart, 
            total: Math.round(currentCart?.reduce((sum , el) => sum + Number(el?.price) * el?.quantity ,0) / 25387),
            address: current?.address
          }}
          setPaymentSuccess={setPaymentSuccess}
          amount={Math.round(currentCart?.reduce((sum , el) => sum + Number(el?.price) * el?.quantity ,0) / 25387)}/>
        </div>
      </div>
    </div>
  )
}

export default withBaseComponent(memo(Checkout))