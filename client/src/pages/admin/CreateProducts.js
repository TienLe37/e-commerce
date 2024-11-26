import { apiCreateProduct } from 'apis';
import { Button, InputForm, Loading, MarkdownEditor, Select } from 'components';
import React, { useCallback, useState,useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { showModal } from 'store/app/appSlice';
import { getBase64, validate } from 'utils/helpers';

const CreateProducts = () => {
  const dispatch = useDispatch()
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
  } = useForm();
  const { categories } = useSelector((state) => state.app);

  const [payload, setPayload] = useState({
    description: '',
  });
  const [preview, setPreview] = useState({
    thumb: null,
    images: []
  })
  const [invalidFields, setInvalidFields] = useState([]);
  const changeValue = useCallback((e) => {
      setPayload(e);
  },[payload]);
  // thumb & image
  const handlePreviewThumb = async (file) => {
    const base64Thumb = await getBase64(file)
    setPreview(prev => ({...prev, thumb: base64Thumb }))
  }
  const handlePreviewImages = async (files) => {
    const imagesPreview = []
    for(let file of files) {
      if(file.type !== 'image/png' && file.type !== 'image/jpeg'){
        toast.warning('File image is not supported')
        return
      }
      const base64 = await getBase64(file)
      imagesPreview.push({name: file.name, path: base64 })
    }
    setPreview(prev => ({...prev, images: imagesPreview }))
  }
  useEffect(() => {
      handlePreviewThumb(watch('thumb')[0])
  }, [watch('thumb')])
  useEffect(() => {
      handlePreviewImages(watch('images'))
   }, [watch('images')])
  
  const handleCreateProduct = async (data) => {
    const invalids = validate(payload, setInvalidFields)
    if(invalids === 0) {
      if (data.category) data.category = categories?.find((el) => el._id === data.category)?.title;
      const finalPayload = { ...data, ...payload }
      const formData = new FormData()
      for(let i of Object.entries(finalPayload)) formData.append(i[0],i[1])
      if(finalPayload.thumb) formData.append('thumb', finalPayload.thumb[0])
      if(finalPayload.images) {
        for(let image of finalPayload.images) 
          formData.append('images', image)
      }
      dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
      const response = await apiCreateProduct(formData)
      dispatch(showModal({ isShowModal: false, modalChildren: null }))
      if(response.success) {
        toast.success(response.mes) 
        reset()
        setPayload({
          thumb: '',
          images: []
        })
      } else toast.error(response.mes)
      
    }
  };
  return (
    <div className='w-full'>
      <h1 className='h-[80px] flex justify-between items-center pl-[10px] text-2xl font-semibold'>
        <span>Create new products</span>
      </h1>
      <div className='p-4'>
        <form onSubmit={handleSubmit(handleCreateProduct)}>
          <InputForm
            label={'Name new product'}
            register={register}
            errors={errors}
            id={'title'}
            fullWidth
            placeholder={'Name of new product'}
            validate={{
              required: 'Required',
            }}
          />
          <div className='w-full my-6 flex gap-4'>
            <InputForm
              label={'Price'}
              register={register}
              errors={errors}
              id={'price'}
              style={'flex-auto'}
              placeholder={'Price of new product'}
              validate={{
                required: 'Required',
              }}
              type={'number'}
            />
            <InputForm
              label={'Quantity'}
              register={register}
              errors={errors}
              id={'quantity'}
              style={'flex-auto'}
              placeholder={'Quantity of new product'}
              validate={{
                required: 'Required',
              }}
              type={'number'}
            />
            <InputForm
              label={'Color'}
              register={register}
              errors={errors}
              id={'color'}
              style={'flex-auto'}
              placeholder={'Color of new product'}
              validate={{
                required: 'Required',
              }}
            />
          </div>
          <div className='w-full my-6 flex gap-4'>
            <Select
              label={'Category'}
              options={categories?.map((el) => ({
                code: el._id,
                value: el.title,
              }))}
              register={register}
              errors={errors}
              id={'category'}
              style={'flex-auto'}
              validate={{ required: 'Required ' }}
              fullWidth
            />
            <Select
              label={'Brand(Optional)'}
              options={categories
                ?.find((el) => el._id === watch('category'))
                ?.brand?.map((el) => ({ code: el, value: el }))}
              register={register}
              errors={errors}
              id={'brand'}
              style={'flex-auto'}
              fullWidth
            />
          </div>
          <MarkdownEditor
            name={'description'}
            changeValue={changeValue}
            label={'Description'}
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
          />
          <div className='flex flex-col gap-2 mt-8'>
            <label className='font-semibold ' htmlFor='thumb' > Upload thumb</label>
            <input 
            type='file'
            id='thumb'
            {...register('thumb',{required: 'Required'})}
            />
            {errors['thumb'] && (<small className='text-xs text-red-500 '>{errors['thumb']?.message}</small>)}
          </div>
          {preview.thumb && 
          <div className='my-4'>
            <img src={preview.thumb} alt='thumbnail' className='w-[200px] object-contain'/>
          </div>}
          <div className='flex flex-col gap-2 mt-8'>
            <label className='font-semibold ' htmlFor='products' > Upload image of products</label>
            <input 
            type='file' 
            id='products' 
            multiple
            {...register('images',{required: 'Required'})}
            />
            {errors['images'] && (<small className='text-xs text-red-500 '>{errors['images']?.message}</small>)}

          </div>
          {preview.images.length > 0 && 
          <div className='my-4 flex w-full gap-3 flex-wrap'>
            {preview.images?.map((el,index) => (
              <img src={el.path} alt='product' className='w-[200px] min-h-[300px] object-cover'/>
            ))}
          </div>}
          <div className='my-4'>
          <Button type='submit'> Submit</Button>
          </div>  
        </form>
      </div>
    </div>
  );
};

export default CreateProducts;
