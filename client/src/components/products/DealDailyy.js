import React, { useState, useEffect, memo } from 'react';
import { AiFillStar, AiOutlineMenu } from 'react-icons/ai';
import { apiGetProducts } from 'apis/product';
import { formatMoney, renderStar, secondsToHms } from 'utils/helpers';
import cmsoon from 'assets/cmsoon.jpg';
import Countdown from 'components/common/Countdown';
import moment from 'moment';
let idInterval;
const DealDailyy = () => {
  const [dealDailyy, setDealDailyy] = useState(null);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);
  const [expireTime, setExpireTime] = useState(false);
  const fetchDealDaily = async () => {
    const response = await apiGetProducts({
      limit: 1,
      page: Math.round(Math.random() * 10),
      totalRatings: 5,
    });
    if (response.success) {
      setDealDailyy(response.products[0]);
      const today = `${moment().format('MM/DD/YYYY')} 7:00:00`;
      const seconds =
        new Date(today).getTime() - new Date().getTime() + 24 * 3600 * 1000;
      const number = secondsToHms(seconds);
      setHour(number.h);
      setMinute(number.m);
      setSecond(number.s);
    } else {
      setHour(0);
      setMinute(59);
      setSecond(59);
    }
  };
  useEffect(() => {
    idInterval && clearInterval(idInterval);
    fetchDealDaily();
  }, [expireTime]);
  useEffect(() => {
    idInterval = setInterval(() => {
      if (second > 0) setSecond((pre) => pre - 1);
      else {
        if (minute > 0) {
          setMinute((pre) => pre - 1);
          setSecond(59);
        } else {
          if (hour > 0) {
            setHour((pre) => pre - 1);
            setMinute(59);
            setSecond(59);
          } else {
            setExpireTime(!expireTime);
          }
        }
      }
    }, 1000);
    return () => {
      clearInterval(idInterval);
    };
  }, [second, minute, hour, expireTime]);
  return (
    <div className='border w-full flex-auto'>
      <div className='flex items-center justify-between p-4 w-full'>
        <span className='flex-1 flex justify-center '>
          <AiFillStar size={30} color='#DD1111' />
        </span>
        <span className='flex-8 font-semibold text-[20px] flex justify-center text-gray-700  '>
          DEAL DAILY
        </span>
        <span className='flex-1'></span>
      </div>
      <div className='ư-full flex flex-col items-center pt-8 px-4 gap-2 '>
        <img
          src={dealDailyy?.thumb || cmsoon}
          alt=''
          className='w[243px] h[243px] object-cover '
        />
        <span className='flex h-4'>
          {renderStar(dealDailyy?.totalRatings, 20)?.map((el, index) => (
            <span key={index}>{el}</span>
          ))}
        </span>
        <span className='line-clamp-1 text-center '>{dealDailyy?.title}</span>
        <span>{`${formatMoney(+dealDailyy?.price)} VNĐ`}</span>
      </div>
      <div className='px-4 mt-8'>
        <div className='flex justify-center gap-2 items-center mb-4'>
          <Countdown unit={'Hour'} number={hour} />
          <Countdown unit={'Minutes'} number={minute} />
          <Countdown unit={'Seconds'} number={second} />
        </div>
        <button
          type='button'
          className='flex gap-2 items-center justify-center w-full bg-main hover:bg-gray-800 text-white font-medium py-2 '
        >
          <AiOutlineMenu />
          <span>Options</span>
        </button>
      </div>
    </div>
  );
};

export default memo(DealDailyy);
