const path = {
  PUBLIC: '/',
  HOME: '',
  ALL: '*',
  LOGIN: 'login',
  PRODUCTS__CATEGORY: ':category',
  PRODUCTS: 'products',
  BLOGS: 'blogs',
  SERVICES: 'services',
  FAQS: 'faq',
  DETAIL_PRODUCT__CATEGORY__PID__TITTLE: ':category/:pid/:title',
  FINAL_REGISTER: 'finalregister/:status',
  RESET_PASSWORD: 'reset-password/:token',
  DETAIL_CART: 'my-shopping-cart',
  CHECK_OUT: 'checkout',
  //  Admin
  ADMIN: 'admin',
  DASHBOARD: 'dashboard',
  MANAGE_USER: 'manage-user',
  MANAGE_PRODUCTS: 'manage-products',
  MANAGE_ORDER: 'manage-order',
  CREATE_PRODUCTS: 'create-products',
  //  member
  MEMBER: 'member',
  PERSONAL: 'personal',
  MY_PURCHASE: 'my-purchase',
  HISTORY: 'buy-history',
  WISHLIST: 'wishlist'

};

export default path;
