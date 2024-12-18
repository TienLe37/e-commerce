import React, { memo } from 'react';
import usePagination from 'hooks/usePagination';
import PagiItem from './PagiItem';
import { useSearchParams } from 'react-router-dom';

const Pagination = ({ totalCount }) => {
  const [params] = useSearchParams();
  const pagination = usePagination(totalCount, +params.get('page') || 1);
  return (
    <div className='flex items-center gap-3'>
      {pagination?.map((el) => (
        <PagiItem key={el}>{el}</PagiItem>
      ))}
    </div>
  );
};

export default memo(Pagination);
