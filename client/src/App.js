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
  DetailCart,
} from './pages/public';
import {
  AdminLayout,
  CreateProducts,
  Dashboard,
  ManageOrder,
  ManageProducts,
  ManageUser,
} from './pages/admin';
import { Checkout, History, MemberLayout, MyCart, MyPurchase, Personal, Wishlist } from './pages/member';
import path from './utils/path';
import { getCategories } from './store/app/asyncActions';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Cart, Modal } from './components';
import { showCart } from 'store/app/appSlice';

function App() {
  const dispatch = useDispatch();
  const { isShowModal, modalChildren, isShowCart } = useSelector((state) => state.app);
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);
  return (
    <div className='font-main relative'>
      {isShowCart && <div
        onClick={() => dispatch(showCart())}
        className='absolute inset-0 bg-black/50 z-50 flex justify-end'>
            <Cart/>
        </div>}
      {isShowModal && <Modal>{modalChildren}</Modal>}
      <Routes>
        <Route path={path.PUBLIC} element={<Public />}>
          <Route path={path.HOME} element={<Home />} />
          <Route path={path.BLOGS} element={<Blogs />} />
          <Route path={path.DETAIL_PRODUCT__CATEGORY__PID__TITTLE} element={<DetailProduct />}/>
          <Route path={path.FAQS} element={<FAQ />} />
          <Route path={path.SERVICES} element={<Services />} />
          <Route path={path.PRODUCTS__CATEGORY} element={<Products />} />
          <Route path={path.RESET_PASSWORD} element={<ResetPassword />} />
          <Route path={path.DETAIL_CART} element={<DetailCart />} />
          <Route path={path.MEMBER} element={<MemberLayout />}>
            <Route path={path.PERSONAL} element={<Personal />} />
            <Route path={path.MY_PURCHASE} element={<MyPurchase />} />
            <Route path={path.WISHLIST} element={<Wishlist />} />
            <Route path={path.HISTORY} element={<History />} />
          </Route>
          <Route path={path.ALL} element={<Home />} />
        </Route>
        <Route path={path.ADMIN} element={<AdminLayout />}>
          <Route path={path.DASHBOARD} element={<Dashboard />} />
          <Route path={path.MANAGE_USER} element={<ManageUser />} />
          <Route path={path.MANAGE_PRODUCTS} element={<ManageProducts />} />
          <Route path={path.MANAGE_ORDER} element={<ManageOrder />} />
          <Route path={path.CREATE_PRODUCTS} element={<CreateProducts />} />
        </Route>
        <Route path={path.CHECK_OUT} element={<Checkout />} />
        <Route path={path.FINAL_REGISTER} element={<FinalRegister />} />
        <Route path={path.LOGIN} element={<Login />} />
      </Routes>
      

      <ToastContainer />
    </div>
  );
}

export default App;
