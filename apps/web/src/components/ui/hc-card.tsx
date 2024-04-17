import * as React from "react"

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

import logo from '../../assets/logo@2x.svg'
import earth from '../../assets/earth.gif'

export interface HCIdCardProps {
  code?: string
  issueDate?: string
}

const HCIdCard: React.FC<HCIdCardProps> = React.memo(({
  code,
  issueDate
}) => {
  // @ts-ignore
  const createDate = issueDate ? dayjs.utc(issueDate).tz(dayjs.tz.guess()).format('MM/DD/YYYY') : ''
  return (
    <div className="flex my-10 relative text-white bg-[linear-gradient(180deg,_#212120_-2.56%,_#313130_89.66%)] rounded-2xl h-56">
      <img src={logo} 
        className={`transition-transform duration-500 ${code ? '-translate-x-24' : 'translate-x-0'}`}
        style={{ position: 'absolute', zIndex: 1, top: 0, left: 0, right: 0, bottom: 0, margin: 'auto'}} />
      <img src={earth} style={{ maxWidth: '100%', height: 'auto', objectFit: 'cover'}} />
      <div
        className={`transition-opacity delay-200 duration-700 ${code ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="absolute flex justify-center items-center text-center top-4 left-0 right-0 text-xs card-title before:content-[''] before:w-[3.1rem] before:h-px before:mr-2 before:bg-[linear-gradient(270.01deg,_#ffffff_.01%,_rgba(255,_255,_255,_0)_100%)] after:content-[''] after:w-[3.1rem] after:h-px after:ml-2 after:bg-[linear-gradient(-270.01deg,_#ffffff_.01%,_rgba(255,_255,_255,_0)_100%)]">
          Republic of Humanity
        </div>
        <div className='absolute left-0 right-0 bottom-0 top-0 flex flex-col justify-center items-center'>
          <div className="pl-24 text-xs font-medium card-title text-center">
            HUMAN ID
          </div>
          <div className="pl-24 text-lg font-serif human-id w-64 mt-3 text-center leading-5">
            {code?.padStart(20, '0').match(/\S{4}/g)?.join(' ') || ''}
          </div>
        </div>
        <div className='absolute bottom-3 text-center left-0 right-0 text-xs text-zinc-400 font-normal font-serif'>
          Date of Issue : {createDate}
        </div>
      </div>
    </div>
  )
});

HCIdCard.displayName = "HCIdCard"

export { HCIdCard }