import { apiAddVarriant } from 'apis';
import Button from 'components/buttons/Button';
import Loading from 'components/common/Loading';
import InputForm from 'components/inputs/InputForm'
import React, { memo,useEffect,useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { showModal } from 'store/app/appSlice';
import Swal from 'sweetalert2';
import { getBase64 } from 'utils/helpers';

const CustomizeVarriant = ({customizeVarriant, setCustomizeVarriant,render}) => {
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
  } = useForm();
  useEffect(() => {
    reset({
        title: customizeVarriant?.title,
        price: customizeVarriant?.price,
        color: customizeVarriant?.color,
    })
  }, [customizeVarriant])
 
  const [preview, setPreview] = useState({
    thumb: '',
    images: [],
  });
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
  const handleAddVarriant = async(data) => {
    if(data.color === customizeVarriant.color) Swal.fire('Oops!', 'Color isn\'t changed','info')
      else {
        const formData = new FormData()
        for(let i of Object.entries(data)) formData.append(i[0],i[1])
        if(data.thumb) formData.append('thumb', data.thumb[0])
        if(data.images) {
          for(let image of data.images) formData.append('images', image)
        }
        dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
        window.scrollTo(0, 0);
        const response = await apiAddVarriant(formData , customizeVarriant._id)
        dispatch(showModal({ isShowModal: false, modalChildren: null }))
        if (response.success) {
          toast.success(response.mes);
          render();
          setPreview({
            thumb: '',
            images: []
          })
        } else toast.error(response.mes);
      }
  }
  return (
    <div className='w-full p-4 bg-gray-100'>
        <div className='h-[80px] flex justify-between items-center font-semibold pl-[10px]  text-2xl'>
            <span>{`Customize Varriant of ${customizeVarriant.title}`} </span>
            <span className='text-sm text-main cursor-pointer hover:underline pr-4' onClick={() => setCustomizeVarriant(null) }>Cancel</span>
        </div>
        <form onSubmit={handleSubmit(handleAddVarriant)}>
            <InputForm
            label={'Name product'}
            register={register}
            errors={errors}
            id={'title'}
            fullWidth
            placeholder={'Name product'}
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
              placeholder={'price of new varriant'}
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
              placeholder={'color of new varriant '}
              style={'flex-auto'}
              validate={{
                required: 'Required',
              }}
            />
          </div>
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
                <img src={el} alt='product' className='w-[200px] min-h-[300px] object-contain'/>
              ))}
            </div>}
          <div className='my-4'>
            <Button type='submit'> Add Varriant</Button>
          </div>
        </form>
    </div>
  )
}

export default memo(CustomizeVarriant)