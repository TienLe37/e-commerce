import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import path from '../../utils/path';

const AdminLayout = () => {
  const { isLoggedIn, current } = useSelector((state) => state.user);
  if (!isLoggedIn || !current || +current.role !== 1945)
    return <Navigate to={`/${path.LOGIN}`} replace={true} />;
  return (
    <div>
      AdminLayout
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
