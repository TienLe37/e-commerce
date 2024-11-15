import { useState, useEffect } from 'react';

const useDebounce = (value, ms) => {
  const [debounceValue, setDebounceValue] = useState('');
  useEffect(() => {
    const setTimeOutid = setTimeout(() => {
      setDebounceValue(value);
    }, ms);
    return () => {
      clearTimeout(setTimeOutid);
    };
  }, [value, ms]);

  return debounceValue;
};

export default useDebounce;

/* Dùng cho filter sản phẩm theo price
    - Chỉ Call Api khi người dùng nhập xong price from - to 
    
    Tách price -> 2 biến
    + 1. biến này phục vụ trên UI. gõ tới đâu lưu tới đó
    + 2. biến này dùng để call api : Dùng setTimeOut => biến sẽ gán sau 1 khoảng thời gian ms
*/
