import React, { useState } from 'react';
import { Button } from '../../components';
import { useParams } from 'react-router-dom';
import { apiResetPassword } from '../../apis/user';
import { toast } from 'react-toastify';
const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const { token } = useParams();
  const handleResetPassword = async () => {
    const response = await apiResetPassword({ password, token });
    console.log(response);
    if (response.success) {
      toast.success(response.mes, { theme: 'colored' });
    } else toast.info(response.mes, { theme: 'colored' });
  };
  return (
    <div className=' absolute top-0 left-0 bottom-0 right-0 bg-white flex flex-col justify-center items-center py-8 z-10 animate-slide-right '>
      <div className='flex flex-col gap-4 '>
        <label htmlFor='password'> Enter your new password:</label>
        <input
          type='text'
          id='password'
          placeholder='New password'
          className='w-[800px] pb-2 border-b outline-none placeholder:text-sm'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className='flex items-center justify-end w-full'>
          <Button name='Submit' handleOnClick={handleResetPassword} hover />
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
