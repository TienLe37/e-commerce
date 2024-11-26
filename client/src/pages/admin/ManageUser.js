import { apiDeleteUserByAdmin, apiGetUsers, apiUpdateUserByAdmin } from 'apis';
import clsx from 'clsx';
import { Button, InputField, InputForm, Pagination, Select } from 'components';
import useDebounce from 'hooks/useDebounce';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BiEdit } from 'react-icons/bi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { isBlockedUser, roles } from 'utils/contants';
import { IoReturnUpBackOutline } from "react-icons/io5";
const ManageUser = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    email: '',
    firstname: '',
    lastname: '',
    role: '',
    mobile: '',
    isBlocked: '',
  });
  const [users, setUsers] = useState();
  const [queries, setQueries] = useState({
    q: '',
  });
  const [params] = useSearchParams();
  const [editUser, setEditUser] = useState(null);
  const fetchUsers = async (params) => {
    const response = await apiGetUsers({
      ...params,
      limit: process.env.REACT_APP_LIMIT,
    });
    if (response.success) setUsers(response);
  };
  const [update, setUpdate] = useState(false);
  const render = useCallback(() => {
    setUpdate(!update);
  }, [update]);
  const queriesDebounce = useDebounce(queries.q, 800);
  useEffect(() => {
    const queries = Object.fromEntries([...params]);
    if (queriesDebounce) queries.q = queriesDebounce;
    fetchUsers(queries);
  }, [queriesDebounce, params, update]);
  const handleUpdateUser = async (data) => {
    const response = await apiUpdateUserByAdmin(data, editUser._id);
    if (response.success) {
      setEditUser(null);
      render();
      toast.success(response.mes);
    } else toast.error(response.mes);
  };
  const handleDeleteUser = (uid) => {
    Swal.fire({
      title: 'Delete User',
      text: 'Are you sure delete user?',
      showCancelButton: true,
    }).then(async (rs) => {
      if (rs.isConfirmed) {
        const response = await apiDeleteUserByAdmin(uid);
        if (response.success) {
          render();
          toast.success(response.mes);
        } else toast.error(response.mes);
      }
    });
  };
  useEffect(() => {
    if (editUser)
      reset({
        email: editUser.email,
        firstname: editUser.firstname,
        lastname: editUser.lastname,
        role: editUser.role,
        mobile: editUser.mobile,
        status: editUser.isBlocked,
      });
  }, [editUser]);

  return (
    <div className={clsx('w-full p-4', editUser && 'pl-[100px]')}>
      <div className='flex justify-end '>
        <InputField
          nameKey={'q'}
          value={queries.q}
          setValue={setQueries}
          style={'w-80'}
          placeholder='Search User'
          isHideLabel={true}
        />
      </div>
      <form onSubmit={handleSubmit(handleUpdateUser)}>
        <table className='table-auto mb-[10px] text-left w-full'>
          <thead className='font-bold bg-gray-700 text-[13px] text-white '>
            <tr className='border border-gray-500'>
              <th className='px-4 py-2'>#</th>
              <th className='px-4 py-2'>Email</th>
              <th className='px-4 py-2'>Firstname</th>
              <th className='px-4 py-2'>Lastname</th>
              <th className='px-4 py-2'>Role</th>
              <th className='px-4 py-2'>Mobile</th>
              <th className='px-4 py-2'>Status</th>
              <th className='px-4 py-2'>createdAt</th>
              <th className='px-4 py-2'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.users?.map((el, index) => (
              <tr key={el._id} className='border border-gray-500'>
                <td className='py-2 px-4'>{index + 1}</td>
                <td className='py-2 px-4'>
                  {editUser?._id === el._id ? (
                    <InputForm
                      fullWidth
                      defaultValue={editUser?.email}
                      register={register}
                      errors={errors}
                      id={'email'}
                      validate={{
                        required: true,
                        pattern: {
                          value:
                            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                          message: 'Invalid email',
                        },
                      }}
                    />
                  ) : (
                    <span>{el.email}</span>
                  )}
                </td>
                <td className='py-2 px-4'>
                  {editUser?._id === el._id ? (
                    <InputForm
                      fullWidth
                      defaultValue={editUser?.firstname}
                      register={register}
                      errors={errors}
                      id={'firstname'}
                      validate={{
                        required: 'Required fill',
                      }}
                    />
                  ) : (
                    <span>{el.firstname}</span>
                  )}
                </td>
                <td className='py-2 px-4'>
                  {editUser?._id === el._id ? (
                    <InputForm
                      fullWidth
                      defaultValue={editUser?.lastname}
                      register={register}
                      errors={errors}
                      id={'lastname'}
                      validate={{ required: 'Required fill' }}
                    />
                  ) : (
                    <span>{el.lastname}</span>
                  )}
                </td>
                <td className='py-2 px-4'>
                  {editUser?._id === el._id ? (
                    <Select
                      fullWidth
                      defaultValue={el.role}
                      register={register}
                      errors={errors}
                      id={'role'}
                      validate={{ required: 'Required fill' }}
                      options={roles}
                    />
                  ) : (
                    <span>
                      {roles.find((role) => +role.code === +el.role)?.value}
                    </span>
                  )}
                </td>

                <td className='py-2 px-4'>
                  {editUser?._id === el._id ? (
                    <InputForm
                      fullWidth
                      defaultValue={editUser?.mobile}
                      register={register}
                      errors={errors}
                      id={'mobile'}
                      validate={{ required: 'Required fill' }}
                    />
                  ) : (
                    <span>{el.mobile}</span>
                  )}
                </td>
                <td className='py-2 px-4'>
                  {editUser?._id === el._id ? (
                    <Select
                      fullWidth
                      defaultValue={el.isBlocked}
                      register={register}
                      errors={errors}
                      id={'isBlocked'}
                      validate={{ required: 'Required fill' }}
                      options={isBlockedUser}
                    />
                  ) : (
                    <span>{el.isBlocked ? 'Blocked' : 'Active'}</span>
                  )}
                </td>
                <td className='py-2 px-4'>
                  {moment(el.createdAt).format('DD/MM/YYYY')}
                </td>
                <td className='py-2  text-center'>
                  {editUser?._id === el._id ? (
                    <span
                      onClick={() => setEditUser(null)}
                    className='px-2 hover:text-orange-600 hover:underline cursor-pointer inline-block text-blue-500 '>
                    <IoReturnUpBackOutline size={20}/>
                    </span>
                  ) : (
                    <span
                    onClick={() => setEditUser(el)}  
                    className='px-2 hover:text-orange-600 hover:underline cursor-pointer inline-block text-blue-500 '>
                        <BiEdit size={18}/>
                    </span>
                  )}
                  <span  
                    onClick={() => handleDeleteUser(el._id)}  
                    className='px-2 hover:text-orange-600 hover:underline cursor-pointer inline-block text-blue-500 '>
                        <RiDeleteBin6Line size={18}/>
                    </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {editUser && (
          <div className='flex float-end '>
            <Button type='submit'>Submit</Button>
          </div>
        )}
      </form>
      <div className='w-full flex justify-center'>
        <Pagination totalCount={users?.counts} />
      </div>
    </div>
  );
};

export default ManageUser;
