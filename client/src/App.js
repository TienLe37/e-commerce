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
} from './pages/public';
import path from './utils/path';
import { getCategories } from './store/app/asyncActions';
import { useDispatch } from 'react-redux';
import { Product } from './components';
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);
  return (
    <div className='min-h-screen font-main'>
      <Routes>
        <Route path={path.PUBLIC} element={<Public />}>
          <Route path={path.HOME} element={<Home />} />
          <Route path={path.BLOGS} element={<Blogs />} />
          <Route
            path={path.DETAIL_PRODUCT__PID__TITTLE}
            element={<DetailProduct />}
          />
          <Route path={path.FAQS} element={<FAQ />} />
          <Route path={path.SERVICES} element={<Services />} />
          <Route path={path.PRODUCTS} element={<Products />} />
        </Route>
        <Route path={path.FINAL_REGISTER} element={<FinalRegister />} />

        <Route path={path.LOGIN} element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
