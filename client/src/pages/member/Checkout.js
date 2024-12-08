import React , {memo, useEffect, useState} from 'react'
import payment from 'assets/mobile-payment.png';
import { useSelector } from 'react-redux';
import { formatMoney } from 'utils/helpers';
import { Congratulation, InputForm, Paypal } from 'components';
import { useForm } from 'react-hook-form';
import withBaseComponent from 'hocs/withBaseComponent';
import { getCurrent } from 'store/user/asyncActions';
const Checkout = ({dispatch}) => {
  const {currentCart, current} = useSelector(state => state.user)
  const {
    register,
    formState: { errors },
    watch,
    setValue
  } = useForm();
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const  address = watch('address')
  useEffect(() => {
    setValue('address', current?.address)
  }, [current.address])
  useEffect(() => {
    if(paymentSuccess) dispatch(getCurrent())
  }, [paymentSuccess])
  
  return (
    <div className='p-8 grid grid-cols-10 h-full max-h-screen overflow-y-auto gap-6 '>
      {paymentSuccess && <Congratulation/>}
      <div className='w-full flex justify-center items-center col-span-4'>
          <img src={payment} alt='payment' className='h-[70%] object-contain'  />
      </div>
      <div className='w-full flex flex-col items-center col-span-6 gap-6'>
        <h2 className='text-3xl font-semibold'>Checkout your order</h2>
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
        <span className='flex items-center gap-6 '>
            <span className='text-[18px] font-semibold text-main'>Subtotal: </span>
            <span className=''>{formatMoney(currentCart?.reduce((sum , el) => sum + Number(el?.price) * el?.quantity ,0)) + ' VNĐ'} </span>
        </span>
        <span className='w-full'>
          <InputForm
            label='Your Address'
            register={register}
            errors={errors}
            id='address'
            validate={{
              required: 'Required'
            }}
            placeholder='Enter your address'
          />
        </span>
        <div className='w-full '>
          <Paypal
            payload={{
            products: currentCart, 
            total: Math.round(currentCart?.reduce((sum , el) => sum + Number(el?.price) * el?.quantity ,0) / 25387),
            address
          }}
          setPaymentSuccess={setPaymentSuccess}
          amount={Math.round(currentCart?.reduce((sum , el) => sum + Number(el?.price) * el?.quantity ,0) / 25387)}/>
        </div>
      </div>
    </div>
  )
}

export default withBaseComponent(Checkout)