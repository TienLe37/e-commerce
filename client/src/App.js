import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import {
  Login,
  Home,
  Public,
  Blogs,
  DetailProduct,
  FAQ,
  Services,
  Products,
  FinalRegister,
  ResetPassword,
} from './pages/public';
import {
  AdminLayout,
  CreateProducts,
  Dashboard,
  ManageOrder,
  ManageProducts,
  ManageUser,
} from './pages/admin';
import { MemberLayout, Personal } from './pages/member';
import path from './utils/path';
import { getCategories } from './store/app/asyncActions';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal } from './components';

function App() {
  const dispatch = useDispatch();
  const { isShowModal, modalChildren } = useSelector((state) => state.app);
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);
  return (
    <div className=' font-main relative'>
      {isShowModal && <Modal>{modalChildren}</Modal>}
      <Routes>
        <Route path={path.PUBLIC} element={<Public />}>
          <Route path={path.HOME} element={<Home />} />
          <Route path={path.BLOGS} element={<Blogs />} />
          <Route
            path={path.DETAIL_PRODUCT__CATEGORY__PID__TITTLE}
            element={<DetailProduct />}
          />
          <Route path={path.FAQS} element={<FAQ />} />
          <Route path={path.SERVICES} element={<Services />} />
          <Route path={path.PRODUCTS} element={<Products />} />
          <Route path={path.RESET_PASSWORD} element={<ResetPassword />} />
          <Route path={path.ALL} element={<Home />} />
        </Route>
        <Route path={path.ADMIN} element={<AdminLayout />}>
          <Route path={path.DASHBOARD} element={<Dashboard />} />
          <Route path={path.MANAGE_USER} element={<ManageUser />} />
          <Route path={path.MANAGE_PRODUCTS} element={<ManageProducts />} />
          <Route path={path.MANAGE_ORDER} element={<ManageOrder />} />
          <Route path={path.CREATE_PRODUCTS} element={<CreateProducts />} />
        </Route>
        <Route path={path.MEMBER} element={<MemberLayout />}>
          <Route path={path.PERSONAL} element={<Personal />} />
        </Route>
        <Route path={path.FINAL_REGISTER} element={<FinalRegister />} />
        <Route path={path.LOGIN} element={<Login />} />
      </Routes>
      

      <ToastContainer />
    </div>
  );
}

export default App;
