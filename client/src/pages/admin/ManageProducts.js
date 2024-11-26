import { apiDeleteProduct, apiGetProducts } from 'apis';
import clsx from 'clsx';
import { CustomizeVarriant, InputForm, Pagination } from 'components';
import useDebounce from 'hooks/useDebounce';
import moment from 'moment';
import React, { useState , useEffect, useCallback } from 'react';
import { set, useForm } from 'react-hook-form';
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import UpdateProduct from './UpdateProduct';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { BiCustomize, BiEdit } from 'react-icons/bi';
import { RiDeleteBin6Line } from 'react-icons/ri';

const ManageProducts = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    watch
  } = useForm();
  
  const [params] = useSearchParams();
  const [products, setProducts] = useState(null);
  const [editProduct, setEditProduct] = useState(null)
  const [update, setUpdate] = useState(false)
  const [customizeVarriant , setCustomizeVarriant ] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  const render = useCallback(() => {
    setUpdate(!update)
  },[update])
  const fetchProducts = async (params) => {
    const response = await apiGetProducts({
      ...params,
      limit: process.env.REACT_APP_LIMIT,
    });
    if (response.success) setProducts(response);
    
  };
  const queryDebounce = useDebounce( watch('q') , 800)
  useEffect(() => {
      if(queryDebounce) {
        navigate({
          pathname: location.pathname,
          search: createSearchParams({q: queryDebounce}).toString()
        })
      } else navigate({
        pathname: location.pathname,
      })
  }, [queryDebounce])
  useEffect(() => {
    const searchParams = Object.fromEntries([...params])
    fetchProducts(searchParams)
  }, [params,update])

  const handleDeleteProduct = (pid) => {
    Swal.fire({
      text: 'Do you sure delete product?',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Delete',
    }).then(async (rs) => {
      if (rs.isConfirmed) {
        const response = await apiDeleteProduct(pid)
        if(response.success) toast.success(response.mes)
          else toast.error(response.mes)
        render()
      }
    });
  }
  return (
    <div className={clsx('w-full pr-[5px] pl-[3px] text-[12px] relative')}>
      {editProduct && <div className='absolute inset-0 min-h-screen bg-white '>
        <UpdateProduct editProduct={editProduct} render={render} setEditProduct={setEditProduct}/>
      </div>}
      {customizeVarriant && <div className='absolute inset-0 min-h-screen bg-gray-100 '>
        <CustomizeVarriant customizeVarriant={customizeVarriant} render={render} setCustomizeVarriant={setCustomizeVarriant}/>
      </div>}
      <div className='w-full flex justify-end items-center'>
        <form className='w-[30%]' >
          <InputForm
            id='q'
            register={register}
            errors={errors}
            fullWidth
            placeholder='Search product'
          />
        </form>
      </div>
      <table className='table-auto mb-[10px] text-left w-full'>
          <thead className='font-bold bg-gray-700 text-[13px] text-white '>
            <tr className='border border-gray-500'>
              <th className='px-4 py-2'>#</th>
              <th className='px-4 py-2'>Thumbnail</th>
              <th className='px-4 py-2'>Title</th>
              <th className='px-4 py-2'>Brand</th>
              <th className='px-4 py-2'>Category</th>
              <th className='px-4 py-2'>Price</th>
              <th className='px-4 py-2'>Quantity</th>
              <th className='px-4 py-2'>Sold</th>
              <th className='px-4 py-2'>Color</th>
              <th className='px-4 py-2'>Ratings</th>
              <th className='px-4 py-2'>createdAt</th>
              <th className='px-4 py-2'>Actions</th>
            </tr>
          </thead>
          <tbody>
          {products?.products?.map((el, index) => (
              <tr key={el._id} className='border border-gray-500'>
                <td className='py-2 px-4'>{(+params.get('page') > 1 ? +params.get('page') -1 : 0 ) * process.env.REACT_APP_LIMIT + index + 1 }</td>
                <td className='py-2 px-4'>
                  <img src={el.thumb} alt='thumb' className='w-12 h-12 object-cover' />
                </td>
                <td className='py-2 px-4'>{el.title}</td>
                <td className='py-2 px-4'>{el.brand}</td>
                <td className='py-2 px-4'>{el.category}</td>
                <td className='py-2 px-4'>{el.price}</td>
                <td className='py-2 px-4'>{el.quantity}</td>
                <td className='py-2 px-4'>{el.sold}</td>
                <td className='py-2 px-4'>{el.color}</td>
                <td className='py-2 px-4'>{el.totalRatings}</td>
                <td className='py-2 px-4'>
                  {moment(el.createdAt).format('DD/MM/YYYY')}
                </td>
                <td className='py-2 '>
                    <span
                    onClick={() => setEditProduct(el)}  
                    className='px-2 hover:text-orange-600 hover:underline cursor-pointer inline-block text-blue-500 '>
                        <BiEdit size={18}/>
                    </span>
                    <span  
                    onClick={() => handleDeleteProduct(el._id)}  
                    className='px-2 hover:text-orange-600 hover:underline cursor-pointer inline-block text-blue-500 '>
                        <RiDeleteBin6Line size={18}/>
                    </span>
                    <span
                    onClick={() => setCustomizeVarriant(el)}  
                    className='px-2 hover:text-orange-600 hover:underline cursor-pointer inline-block text-blue-500 '>
                        <BiCustomize size={18}/>
                    </span>
                </td>
                
              </tr>
          ))}
          </tbody>
      </table>
      <div className='w-full m-auto my-4 flex justify-center'>
        <Pagination totalCount={products?.counts} />
      </div>
    </div>
  );
};

export default ManageProducts;
