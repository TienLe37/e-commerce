import React, { useCallback, useState } from 'react';
import login from '../../assets/login.jpg';
import { Button, InputField } from '../../components';
import { apiLogin, apiRegister } from '../../apis/user';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import path from '../../utils/path';
import { useDispatch } from 'react-redux';
import { register } from '../../store/user/userSlice';
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
          register({
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
  return (
    <div className='w-screen h-screen relative'>
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
          />
          <div className='flex items-center justify-between w-full text-sm mt-2'>
            {!isRegister && (
              <span className='text-gray-800 hover:underline cursor-pointer'>
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
