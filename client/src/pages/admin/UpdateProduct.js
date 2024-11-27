import { apiCreateProduct, apiUpdateProduct } from 'apis';
import { Button, InputForm, Loading, MarkdownEditor, Select } from 'components';
import React, { memo, useCallback, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { showModal } from 'store/app/appSlice';
import { getBase64, validate } from 'utils/helpers';

const UpdateProduct = ({ editProduct, render , setEditProduct }) => {
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
  } = useForm();
  const [payload, setPayload] = useState({
    description: '',
  });
  const { categories } = useSelector((state) => state.app);

  const [preview, setPreview] = useState({
    thumb: null,
    images: [],
  });
  useEffect(() => {
    reset({
        title: editProduct?.title || '',
        price: editProduct?.price || '',
        quantity: +editProduct?.quantity || '',
        color: editProduct?.color || '',
        category: editProduct?.category || '',
        brand: editProduct?.brand?.toLowerCase() || '',
    })
    setPayload({description: typeof editProduct?.description === 'object' ? editProduct?.description?.join(',') : editProduct?.description})
    setPreview({
        thumb: editProduct?.thumb || '',
        images: editProduct?.images || [],
    })
  }, [editProduct])
  
  const [invalidFields, setInvalidFields] = useState([]);
  const changeValue = useCallback((e) => {
    setPayload(e);
    },[payload] );
  const handlePreviewThumb = async (file) => {
    const base64Thumb = await getBase64(file);
    setPreview((prev) => ({ ...prev, thumb: base64Thumb }));
  };
  const handlePreviewImages = async (files) => {
    const imagesPreview = [];
    for (let file of files) {
      if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
        toast.warning('File image is not supported');
        return;
      }
      const base64 = await getBase64(file);
      imagesPreview.push(base64);
    }
    setPreview((prev) => ({ ...prev, images: imagesPreview }));
  };
  useEffect(() => { 
    if( watch('thumb') instanceof FileList &&  watch('thumb').length > 0 ) handlePreviewThumb(watch('thumb')[0]);
  }, [watch('thumb')]);
  useEffect(() => {
    if(watch('images') instanceof FileList &&  watch('images').length > 0) handlePreviewImages(watch('images'));
  }, [watch('images')]);

  const handleUpdateProduct = async (data) => {
    const invalids = validate(payload, setInvalidFields);
    if (invalids === 0) {
      if (data.category) data.category = categories?.find((el) => el.title === data.category)?.title;
      const finalPayload = { ...data, ...payload };
      finalPayload.thumb = data?.thumb?.length === 0 ? preview.thumb : data.thumb[0]  
      const formData = new FormData();
      for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1]);
      finalPayload.images = data?.images?.length === 0 ? preview.images : data.images
      for (let image of finalPayload.images) formData.append('images', image);
      dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
      window.scrollTo(0, 0);
      const response = await apiUpdateProduct(formData, editProduct._id);
      dispatch(showModal({ isShowModal: false, modalChildren: null }));
      if (response.success) {
        toast.success(response.mes);
        render();
        setEditProduct(null)
      } else toast.error(response.mes);
    }
  };
  return (
    <div className='w-full  bg-gray-100'>
      <div className='h-[80px] flex justify-between items-center font-semibold pl-[10px]  text-2xl'>
        <span>{`Update product ${editProduct.title}`} </span>
        <span className='text-sm text-main cursor-pointer hover:underline pr-4' onClick={() => setEditProduct(null) }>Cancel</span>
      </div>
      <div className='p-4'>
        <form onSubmit={handleSubmit(handleUpdateProduct)}>
          <InputForm
            label={'Name new product'}
            register={register}
            errors={errors}
            id={'title'}
            fullWidth
            placeholder={'Update name'}
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
              placeholder={'Update price'}
              style={'flex-auto'}
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
              placeholder={'Update quantity '}
              style={'flex-auto'}
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
              placeholder={'Update color '}
              style={'flex-auto'}
              validate={{
                required: 'Required',
              }}
            />
          </div>
          <div className='w-full my-6 flex gap-4'>
            <Select
              label={'Category'}
              options={categories?.map((el) => ({ code: el.title, value: el.title}))}
              register={register}
              errors={errors}
              id={'category'}
              style={'flex-auto'}
              validate={{ required: 'Required ' }}
              fullWidth
            />
            <Select
              label={'Brand(Optional)'}
              options={categories?.find((el) => el.title === watch('category'))?.brand?.map((el) => ({ code: el.toLowerCase(), value: el }))}
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
            value={payload.description}
          />
          <div className='flex flex-col gap-2 mt-8'>
            <label className='font-semibold ' htmlFor='thumb'>
              Upload thumb
            </label>
            <input
              type='file'
              id='thumb'
              {...register('thumb')}
            />
            {errors['thumb'] && (
              <small className='text-xs text-red-500 '>
                {errors['thumb']?.message}
              </small>
            )}
          </div>
          {preview.thumb && (
            <div className='my-4'>
              <img
                src={preview.thumb}
                alt='thumbnail'
                className='w-[200px] object-contain'
              />
            </div>
          )}
          <div className='flex flex-col gap-2 mt-8'>
            <label className='font-semibold ' htmlFor='products'>
              Upload image of products
            </label>
            <input
              type='file'
              id='products'
              multiple
              {...register('images')}
            />
            {errors['images'] && (
              <small className='text-xs text-red-500 '>
                {errors['images']?.message}
              </small>
            )}
          </div>
          {preview.images.length > 0 && (
            <div className='my-4 flex w-full gap-3 flex-wrap'>
              {preview.images?.map((el, index) => (
                <img
                  src={el}
                  alt='product'
                  className='w-[200px] min-h-[200px] object-cover'
                />
              ))}
            </div>
          )}
          <div className='my-4'>
            <Button type='submit'> Update</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default memo(UpdateProduct);
