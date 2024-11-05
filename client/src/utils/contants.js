import { BsReplyFill, BsShieldShaded } from 'react-icons/bs';
import path from './path';
import { RiTruckFill } from 'react-icons/ri';
import { AiFillGift } from 'react-icons/ai';
import { FaTty } from 'react-icons/fa';
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
