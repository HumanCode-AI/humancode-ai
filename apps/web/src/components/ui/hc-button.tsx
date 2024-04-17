import * as React from "react"

import { Button } from "./button"

import finishedIcon from '../../assets/finished.png'
// import { UpdateIcon } from "@radix-ui/react-icons"


export interface HCButtonProps {
  idx: number
  title: string;
  titleIcon?: any;
  disabled?: boolean;
  loading?: boolean;
  finished?: boolean;
  onClick: () => void;
}

const HCButton: React.FC<HCButtonProps> = React.memo(({
  idx = 1,
  title,
  titleIcon,
  disabled = false,
  loading = false,
  finished = false,
  onClick,
}) => {
  return (
    <div>
      <Button size={'lg'} className={`w-full ${loading ? 'justify-center' : 'justify-between' }`} disabled={disabled} onClick={onClick}>
        {loading ? (
          <div className="flex flex-row justify-center items-center self-center"><span>Loading...</span></div>
        ): (
          <>
            <div className={`w-5 h-5 rounded-full border border-white text-white text-center font-bold flex justify-center items-center ${disabled ? 'opacity-50' : ''}`}>{idx}</div>
            {titleIcon ? (
              <div className='flex'><span className={`font-semibold ${disabled ? 'opacity-50' : ''}`}>{title}</span>{titleIcon}</div>
            ): (
              <span className={`font-semibold ${disabled ? 'opacity-50' : ''}`}>{title}</span>
            )}
            <img src={finishedIcon} width={20} height={20} style={{ opacity: finished ? 1 : 0 }} />
          </>
        )}
      </Button>
    </div>
  )
});

HCButton.displayName = "HCButton"

export { HCButton }
