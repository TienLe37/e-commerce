import { Button, InputForm, MarkdownEditor, Select } from 'components';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { validate } from 'utils/helpers';

const CreateProducts = () => {
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
 
  const [invalidFields, setInvalidFields] = useState([]);
  const changeValue = useCallback((e) => {
      setPayload(e);
  },[payload]);
  
  const handleCreateProduct = (data) => {
    const invalids = validate(payload, setInvalidFields)
    if(invalids === 0) {
      if (data.category) data.category = categories?.find((el) => el._id === data.category)?.title;
      const finalPayload = { ...data, ...payload }
      console.log(finalPayload);
      const formData = new FormData()
      for(let i of Object.entries(finalPayload)) formData.append(i[0],i[1])
    }
  };
  return (
    <div className='w-full'>
      <h1 className='h-[80px] flex justify-between items-center text-3xl'>
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
          <div className='my-4'>
          <Button type='submit'> Create new product</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProducts;
