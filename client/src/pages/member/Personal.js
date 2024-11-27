import { Button, InputForm } from 'components';
import moment from 'moment';
import React ,{ useEffect,useState}from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import avatar from 'assets/avatarDefault.png';
import { apiUpdateCurrent } from 'apis';
import { getCurrent } from 'store/user/asyncActions';
import { toast } from 'react-toastify';
import { getBase64 } from 'utils/helpers';

const Personal = () => {
  const { current } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const {
    register,
    formState: { errors, isDirty },
    reset,
    handleSubmit,
    watch,
  } = useForm();
  
  useEffect(() => {
      reset({
        firstname: current?.firstname,
        lastname: current?.lastname,
        mobile: current?.mobile,
        email: current?.email,
        avatar: current?.avatar,
      })
      setPreview({
        avatar: current?.avatar || ''
      })
  },[current])
  const [preview, setPreview] = useState({
    avatar: ''
   })
   const handlePreviewAvatar = async (file) => {
     const base64Thumb = await getBase64(file)
     setPreview(prev => ({...prev, avatar: base64Thumb }))
   }
   useEffect(() => { 
    if( watch('avatar') instanceof FileList &&  watch('avatar').length > 0 ) handlePreviewAvatar(watch('avatar')[0]);
  }, [watch('avatar')]);
  const handleUpdateInfor = async (data) => {
    const formData = new FormData()
    if(data?.avatar?.length > 0) formData.append('avatar', data.avatar[0])
    delete data.avatar
    for(let i of Object.entries(data)) formData.append(i[0],i[1])
    const response = await apiUpdateCurrent(formData)
    if(response.success) {
        dispatch(getCurrent())
        toast.success(response.mes)
    } else toast.error(response.mes)
  }
  return ( 
    <div className='w-full relative px-4'>
        <header className='text-3xl font-semibold py-4 border-b border-gray-500'>
          Personal
        </header>
        <form onSubmit={handleSubmit(handleUpdateInfor)}
         className='w-3/5 mx-auto py-8 flex flex-col gap-6 '>
          <InputForm
            label='Firstname'
            register={register}
            errors={errors}
            id='firstname'
            fullWidth
            validate={{
              required: 'Required',
            }}
            />  
            <InputForm
            label='Lastname'
            register={register}
            errors={errors}
            id='lastname'
            fullWidth
            validate={{
              required: 'Required',
            }}
            />  
            <InputForm
            label='Email'
            register={register}
            errors={errors}
            id='email'
            fullWidth
            validate={{
              required: 'Required',
              pattern: {
                value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                message: 'Invalid email',
              },
            }}
            /> 
            <InputForm
            label='Mobile'
            register={register}
            errors={errors}
            id='mobile'
            fullWidth
            validate={{
              required: 'Required',
              pattern: {
                value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
                message: 'Phone number invalid'
              }
            }}
            />   
            <div className='flex items-center gap-2'>
              <span className=''>Account status:</span>
              <span className=''>{current?.isBlocked ?  'Blocked' : 'Actived'}</span>
            </div>
            <div className='flex items-center gap-2'>
              <span className=''>Role:</span>
              <span className=''>{+current?.role === 1945 ?  'Admin' : 'User'}</span>
            </div>
            <div className='flex items-center gap-2'>
              <span className=''>Created At:</span>
              <span className=''>{moment(current?.createdAt).fromNow()}</span>
            </div>
            <div className='flex flex-col gap-2 '>
              {/* <span className='font-medium'>Avatar:</span>
              <input type='file' id='file' {...register('avatar')}></input>
              <label htmlFor='file'>
                <img src={current?.avatar || avatar} alt='avatar' 
                className='w-20 h-20 object-cover rounded-full'
                ></img>
              </label> */}
            <label className='font-semibold ' htmlFor='avatar'>
              Upload Avatar
            </label>
            <input type='file' id='avatar' {...register('avatar')} />
            </div>
            {preview.avatar && (
            <div className=''>
              <img
                src={preview.avatar || avatar}
                alt='avatar'
                className='w-[150px] object-contain'
              />
            </div>
          )}
            {isDirty && <div className='flex justify-end' >
              <Button type='submit'>Update Information</Button>
            </div>}
        </form>
    </div>
  )
};

export default Personal;
