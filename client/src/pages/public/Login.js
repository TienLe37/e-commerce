import React, { useCallback, useState } from 'react';
import login from '../../assets/login.jpg';
import { Button, InputField } from '../../components';
const Login = () => {
  const [payload, setPayload] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [isRegister, setisRegister] = useState(false);
  const handleSubmit = useCallback(() => {
    console.log(payload);
  }, [payload]);
  return (
    <div className='w-screen h-screen relative'>
      <img src={login} alt='' className='w-full h-full object-cover' />
      <div className=' absolute top-0 bottom-0 left-0 right-1/2 items-center justify-center flex'>
        <div className='p-8 bg-white flex flex-col items-center rounded-md min-w-[500px]'>
          <h1 className='text-[28px] font-semibold text-main mb-8'>
            {isRegister ? 'Register' : 'Login'}
          </h1>
          {isRegister && (
            <InputField
              value={payload.name}
              setValue={setPayload}
              nameKey='name'
            />
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
