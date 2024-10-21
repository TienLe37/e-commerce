import React, { useState, useEffect } from 'react';
import { apiGetCategories } from '../apis/app';
const Sidebar = () => {
  const [categories, setCategories] = useState(null);
  const fetchCategories = async () => {
    const response = await apiGetCategories();
    if (response.success) setCategories(response.Categories);
  };
  useEffect(() => {
    fetchCategories();
  }, []);
  // console.log(categories);
  return <div>Sidebar</div>;
};

export default Sidebar;
