import React, { useCallback, useState } from 'react';
import login from '../../assets/login.jpg';
import { Button, InputField } from '../../components';
import { apiForgotPassword, apiLogin, apiRegister } from '../../apis/user';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import path from '../../utils/path';
import { useDispatch } from 'react-redux';
import { loggedIn } from '../../store/user/userSlice';
import { toast } from 'react-toastify';
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [payload, setPayload] = useState({
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    mobile: '',
  });
  const [isRegister, setisRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const resetPayload = () => {
    setPayload({
      email: '',
      password: '',
      firstname: '',
      lastname: '',
      mobile: '',
    });
  };
  const handleSubmit = useCallback(async () => {
    const { firstname, lastname, mobile, ...data } = payload;
    if (isRegister) {
      const response = await apiRegister(payload);
      if (response.success) {
        Swal.fire('Congratulation!', response.mes, 'success').then(() => {
          setisRegister(false);
          resetPayload();
        });
      } else {
        Swal.fire('Fail!', response.mes, 'error');
      }

      console.log(response);
    } else {
      const rs = await apiLogin(data);
      if (rs.success) {
        dispatch(
          loggedIn({
            isLoggedIn: true,
            token: rs.accessToken,
            userData: rs.userData,
          })
        );
        navigate(`/${path.HOME}`);
      } else {
        Swal.fire('Fail!', rs.mes, 'error');
      }
    }
  }, [payload, isRegister]);
  const [email, setEmail] = useState('');
  const handleForgotPassword = async () => {
    const response = await apiForgotPassword({ email });
    if (response.success) {
      toast.success(response.mes, { theme: 'colored' });
    } else toast.info(response.mes, { theme: 'colored' });
  };
  return (
    <div className='w-screen h-screen relative'>
      {isForgotPassword && (
        <div className=' absolute top-0 left-0 bottom-0 right-0 bg-white flex flex-col justify-center items-center py-8 z-10 animate-slide-right '>
          <div className='flex flex-col gap-4 '>
            <label htmlFor='email'> Enter your email:</label>
            <input
              type='text'
              id='email'
              placeholder='email@gmail.com'
              className='w-[800px] pb-2 border-b outline-none placeholder:text-sm'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className='flex items-center justify-between w-full'>
              <Button
                name='Back'
                handleOnClick={() => setIsForgotPassword(false)}
                hover
              />
              <Button
                name='Submit'
                handleOnClick={handleForgotPassword}
                hover
              />
            </div>
          </div>
        </div>
      )}
      <img src={login} alt='' className='w-full h-full object-cover' />
      <div className=' absolute top-0 bottom-0 left-0 right-0 items-center justify-center flex'>
        <div className='p-8 bg-white flex flex-col items-center rounded-md min-w-[500px]'>
          <h1 className='text-[28px] font-semibold text-main mb-8'>
            {isRegister ? 'Register' : 'Login'}
          </h1>
          {isRegister && (
            <div className='flex gap-2 items-center'>
              <InputField
                value={payload.firstname}
                setValue={setPayload}
                nameKey='firstname'
              />
              <InputField
                value={payload.lastname}
                setValue={setPayload}
                nameKey='lastname'
              />
            </div>
          )}
          <InputField
            value={payload.email}
            setValue={setPayload}
            nameKey='email'
          />
          <InputField
            value={payload.password}
            setValue={setPayload}
            nameKey='password'
            type='password'
          />
          {isRegister && (
            <InputField
              value={payload.mobile}
              setValue={setPayload}
              nameKey='mobile'
            />
          )}
          <Button
            name={isRegister ? 'Register' : 'Login'}
            handleOnClick={handleSubmit}
            fw
            hover
          />
          <div className='flex items-center justify-between w-full text-sm mt-2'>
            {!isRegister && (
              <span
                onClick={() => setIsForgotPassword(true)}
                className='text-gray-800 hover:underline cursor-pointer'
              >
                Forgot your account?
              </span>
            )}
            {!isRegister && (
              <span
                onClick={() => setisRegister(true)}
                className='text-gray-800 hover:underline cursor-pointer'
              >
                Create account
              </span>
            )}
            {isRegister && (
              <span
                onClick={() => setisRegister(false)}
                className='text-gray-800 hover:underline w-full cursor-pointer text-center'
              >
                Login
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
