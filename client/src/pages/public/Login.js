import React, { useCallback, useState, useEffect } from 'react';
import { Button, InputField, Loading } from 'components';
import {
  apiFinalRegister,
  apiForgotPassword,
  apiLogin,
  apiRegister,
} from 'apis/user';
import Swal from 'sweetalert2';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import path from 'utils/path';
import { useDispatch } from 'react-redux';
import { loggedIn } from 'store/user/userSlice';
import { toast } from 'react-toastify';
import { validate } from 'utils/helpers';
import { showModal } from 'store/app/appSlice';
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
  const [invalidFields, setInvalidFields] = useState([]);
  const [isRegister, setisRegister] = useState(false);
  const [isVeryfyEmail, setIsVeryfyEmail] = useState(false);
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [searchParams] = useSearchParams()
  const resetPayload = () => {
    setPayload({
      email: '',
      password: '',
      firstname: '',
      lastname: '',
      mobile: '',
    });
  };
  useEffect(() => {
    resetPayload();
  }, [isRegister]);

  // đăng kí - đăng nhập account
  const handleSubmit = useCallback(async () => {
    const { firstname, lastname, mobile, ...data } = payload;
    const invalids = isRegister
      ? validate(payload, setInvalidFields)
      : validate(data, setInvalidFields);
    if (invalids === 0) {
      if (isRegister) {
        dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
        const response = await apiRegister(payload);
        dispatch(showModal({ isShowModal: false, modalChildren: null }));
        if (response.success) {
          setIsVeryfyEmail(true);
        } else Swal.fire('Fail!', response.mes, 'error');
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
          searchParams.get('redirect') ? navigate(searchParams.get('redirect')) :  navigate(`/${path.HOME}`);
         
        } else {
          Swal.fire('Fail!', rs.mes, 'error');
        }
      }
    }
  }, [payload, isRegister]);

  const finalRegister = async () => {
    const response = await apiFinalRegister(token);
    if (response.success) {
      Swal.fire('Congratulation!', response.mes, 'success').then(() => {
        setisRegister(false);
        resetPayload();
      });
    } else {
      Swal.fire('Fail!', response.mes, 'error');
    }
    setIsVeryfyEmail(false);
    setToken('');
  };

  //----------------- quên mật khẩu------------------

  const handleForgotPassword = async () => {
    const response = await apiForgotPassword({ email });
    if (response.success) {
      toast.success(response.mes, { theme: 'colored' });
    } else toast.info(response.mes, { theme: 'colored' });
  };
  return (
    <div className='w-screen h-screen relative'>
      {isVeryfyEmail && (
        <div className=' absolute top-0 left-0 right-0 bottom-0 bg-black/50  z-50 flex flex-col justify-center items-center '>
          <div className='bg-white w-[500px] rounded-md p-8'>
            <h3> Mã xác thực đăng kí được gửi qua email. Vui lòng nhập mã: </h3>
            <input
              type='text'
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className='p-2 border rounded-md outline-none mr-4 '
            />
            <Button children='Submit' handleOnClick={finalRegister} hover />
          </div>
        </div>
      )}
      {isForgotPassword && (
        <div className=' absolute top-0 left-0 bottom-0 right-0 bg-white flex flex-col justify-center items-center py-8 z-10 animate-slide-right '>
          <div className='flex flex-col gap-4 shadow-2xl p-[50px]'>
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
                children='Back'
                handleOnClick={() => setIsForgotPassword(false)}
                hover
              />
              <Button
                children='Submit'
                handleOnClick={handleForgotPassword}
                hover
              />
            </div>
          </div>
        </div>
      )}
      {/* <img src={login} alt='' className='w-full h-full object-cover' />
       */}
      <div className='w-full h-full object-cover bg-[#f8fafb]'></div>
      <div className=' absolute top-0 bottom-0  left-0 right-0 items-center justify-center flex'>
        <div className='p-8 bg-white flex flex-col items-center shadow-2xl border rounded-md min-w-[500px]'>
          <h1 className='text-[28px] font-semibold text-main mb-8'>
            {isRegister ? 'Register' : 'Login'}
          </h1>
          {isRegister && (
            <div className='flex gap-2 items-center'>
              <InputField
                value={payload.firstname}
                setValue={setPayload}
                nameKey='firstname'
                invalidFields={invalidFields}
                setInvalidFields={setInvalidFields}
                fullWidth
              />
              <InputField
                value={payload.lastname}
                setValue={setPayload}
                nameKey='lastname'
                invalidFields={invalidFields}
                setInvalidFields={setInvalidFields}
                fullWidth
              />
            </div>
          )}
          <InputField
            value={payload.email}
            setValue={setPayload}
            nameKey='email'
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
            fullWidth
          />
          <InputField
            value={payload.password}
            setValue={setPayload}
            nameKey='password'
            type='password'
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
            fullWidth
          />
          {isRegister && (
            <InputField
              value={payload.mobile}
              setValue={setPayload}
              nameKey='mobile'
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
              fullWidth
            />
          )}
          <Button
            children={isRegister ? 'Register' : 'Login'}
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
          {!isRegister && (
            <Link
              to={`/${path.HOME}`}
              className='text-gray-800 hover:underline cursor-pointer'
            >
              Go Home
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
