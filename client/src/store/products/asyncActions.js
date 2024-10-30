import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiGetProduct } from '../../apis/product';

// get categories
export const getNewProducts = createAsyncThunk(
  'product/newProducts',
  async (data, { rejectWithValue }) => {
    const response = await apiGetProduct({ sort: 'createdAt' });
    if (!response.success) return rejectWithValue(response);
    return response.products;
  }
);
