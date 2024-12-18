import clsx from 'clsx';
import { memo } from 'react';
import {
  useNavigate,
  useParams,
  useSearchParams,
  createSearchParams,
  useLocation,
} from 'react-router-dom';
const PagiItem = ({ children }) => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const handlePagination = () => {
    let queries = {};
    for (let i of params) queries[i[0]] = i[1];
    if (Number(children)) queries.page = children;
    navigate({
      pathname: location.pathname,
      search: createSearchParams(queries).toString(),
    });
  };
  return (
    <button
      className={clsx(
        'w-10 h-10 flex  justify-center ',
        !Number(children) && 'items-end pb-2',
        Number(children) && 'items-center  border-[2px] hover:bg-gray-300',
        +params.get('page') === +children && 'border bg-gray-300 ',
        !+params.get('page') && +children === 1 && 'border bg-gray-300'
      )}
      onClick={handlePagination}
      type='button'
      disabled={!Number(children)}
    >
      {children}
    </button>
  );
};

export default memo(PagiItem);
