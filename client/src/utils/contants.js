import { BsFillCartCheckFill, BsReplyFill, BsShieldShaded } from 'react-icons/bs';
import path from './path';
import { RiBillLine, RiTruckFill } from 'react-icons/ri';
import { AiFillGift, AiOutlineDashboard } from 'react-icons/ai';
import { TbBrandProducthunt } from 'react-icons/tb';
import { FaTty } from 'react-icons/fa';
import { MdGroups, MdWorkHistory } from 'react-icons/md';
import { FaCartShopping, FaHeartCirclePlus } from "react-icons/fa6";
import { IoMdPerson } from 'react-icons/io';
export const navigation = [
  {
    id: 1,
    value: 'HOME',
    path: `${path.HOME}`,
  },
  {
    id: 2,
    value: 'PRODUCTS',
    path: `${path.PRODUCTS}`,
  },
  {
    id: 3,
    value: 'BLOGS',
    path: `${path.BLOGS}`,
  },
  {
    id: 4,
    value: 'SERVICES',
    path: `${path.SERVICES}`,
  },
  {
    id: 5,
    value: 'FAQS',
    path: `${path.FAQS}`,
  },
];

export const productExtraInfo = [
  {
    id: '1',
    title: 'Guarantee',
    sub: 'Quantity Checked',
    icon: <BsShieldShaded />,
  },
  {
    id: '2',
    title: 'Free Ship',
    sub: 'Free On All Products',
    icon: <RiTruckFill />,
  },
  {
    id: '3',
    title: 'Special Gift Cards',
    sub: 'Special Gift Cards',
    icon: <AiFillGift />,
  },
  {
    id: '4',
    title: 'Free Return',
    sub: 'Within 7 days',
    icon: <BsReplyFill />,
  },
  {
    id: '5',
    title: 'Consultancy',
    sub: 'Lifetime 24/7/365',
    icon: <FaTty />,
  },
];

export const productInfoTabs = [
  {
    id: 1,
    name: 'WARRANTY',
    content: `
  Limited Warranties are non-transferable. The following Limited Warranties are given to the original retail purchaser of the following Ashley Furniture Industries, Inc.Products:
  Frames Used In Upholstered and Leather Products
  Limited Lifetime Warranty
  A Limited Lifetime Warranty applies to all frames used in sofas, couches, love seats, upholstered chairs, ottomans, sectionals, and sleepers. Ashley Furniture Industries,Inc. warrants these components to you, the original retail purchaser, to be free from material manufacturing defects.`,
  },
  {
    id: 2,
    name: 'DELIVERY',
    content: `Customers are able to pick the next available delivery day that best fits their schedule. However, to route stops as efficiently as possible, Shopify Shop will provide the time frame. Customers will not be able to choose a time.
    You will be notified in advance of your scheduled time frame. Please make sure that a responsible adult (18 years or older) will be home at that time.
    In preparation for your delivery, please remove existing furniture, pictures, mirrors, accessories, etc. to prevent damages. 
    Also insure that the area where you would like your furniture placed is clear of any old furniture and any other items that may obstruct the passageway of the delivery team. 
    Shopify Shop will deliver, assemble, and set-up your new furniture purchase and remove all packing materials from your home. Our delivery crews are not permitted to move your existing furniture or other household items. 
    Delivery personnel will attempt to deliver the purchased items in a safe and controlled manner but will not attempt to place furniture if they feel it will result in damage to the product or your home. 
    Delivery personnel are unable to remove doors, hoist furniture or carry furniture up more than 3 flights of stairs. An elevator must be available for deliveries to the 4th floor and above.`,
  },
  {
    id: 3,
    name: 'PAYMENT',
    content: `Before you make your purchase, it’s helpful to know the measurements of the area you plan to place the furniture. 
    You should also measure any doorways and hallways through which the furniture will pass to get to its final destination.
    Picking up at the store
    Shopify Shop requires that all products are properly inspected BEFORE you take it home to insure there are no surprises. 
    Our team is happy to open all packages and will assist in the inspection process. We will then reseal packages for safe transport.
    We encourage all customers to bring furniture pads or blankets to protect the items during transport as well as rope or tie downs. Shopify Shop will not be responsible for damage that occurs after leaving the store or during transit. 
    It is the purchaser’s responsibility to make sure the correct items are picked up and in good condition.`,
  },
];

export const colors = [
  'Black',
  'Brown',
  'Gray',
  'Pink',
  'White',
  'Yellow',
  'Orange',
  'Purple',
  'Green',
  'Blue',
];

export const sortBy = [
  {
    id: 1,
    value: 'sold',
    text: 'Best Selling',
  },
  {
    id: 2,
    value: 'title',
    text: 'From A - Z',
  },
  {
    id: 3,
    value: '-title',
    text: 'From Z - A',
  },
  {
    id: 4,
    value: 'price',
    text: 'Price: Low to High',
  },
  {
    id: 5,
    value: '-price',
    text: 'Price: High to Low',
  },
  {
    id: 6,
    value: 'createdAt',
    text: 'Date: old to new',
  },
  {
    id: 7,
    value: '-createdAt',
    text: 'Date: new to old',
  },
];
export const voteOptions = [
  {
    id: 1,
    text: 'Terrible',
  },
  {
    id: 2,
    text: 'Bad',
  },
  {
    id: 3,
    text: 'Normal',
  },
  {
    id: 4,
    text: 'Good',
  },

  {
    id: 5,
    text: 'Perfect',
  },
];
// Admin
export const adminSidebar = [
  {
    id: 1,
    type: 'SINGLE',
    text: 'Dashboard',
    path: `/${path.ADMIN}/${path.DASHBOARD}`,
    icon: <AiOutlineDashboard size={30} />,
  },
  {
    id: 2,
    type: 'SINGLE',
    text: 'Manage users',
    path: `/${path.ADMIN}/${path.MANAGE_USER}`,
    icon: <MdGroups size={30} />,
  },
  {
    id: 3,
    type: 'PARENT',
    text: 'Manage Product',
    icon: <TbBrandProducthunt size={30} />,
    submenu: [
      {
        text: 'Create product',
        path: `/${path.ADMIN}/${path.CREATE_PRODUCTS}`,
      },
      {
        text: 'Manage product',
        path: `/${path.ADMIN}/${path.MANAGE_PRODUCTS}`,
      },
    ],
  },
  {
    id: 4,
    type: 'SINGLE',
    text: 'Manage orders',
    path: `/${path.ADMIN}/${path.MANAGE_ORDER}`,
    icon: <RiBillLine size={30} />,
  },
];
// member
export const memberSidebar = [
  {
    id: 1,
    type: 'SINGLE',
    text: 'Personal',
    path: `/${path.MEMBER}/${path.PERSONAL}`,
    icon: <IoMdPerson size={30} />,
  },
  {
    id: 2,
    type: 'SINGLE',
    text: 'My Purchase',
    path: `/${path.MEMBER}/${path.MY_PURCHASE}`,
    icon: <BsFillCartCheckFill size={30} />,
  },
  
  {
    id: 3,
    type: 'SINGLE',
    text: 'Buy history',
    path: `/${path.MEMBER}/${path.HISTORY}`,
    icon: <MdWorkHistory size={30} />,
  },
  {
    id: 4,
    type: 'SINGLE',
    text: 'Wishlist',
    path: `/${path.MEMBER}/${path.WISHLIST}`,
    icon: <FaHeartCirclePlus size={30} />,
  },
];
export const roles = [
  {
    code: 1945,
    value: 'Admin',
  },
  {
    code: 1979,
    value: 'User',
  },
];
export const isBlockedUser = [
  {
    code: true,
    value: 'Blocked',
  },
  {
    code: false,
    value: 'Active',
  },
];
