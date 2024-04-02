// import './IndexPage.css';

// import { type FC } from 'react';
// import { TonConnectButton } from "@tonconnect/ui-react";
// import ton from '../../assets/ton.png'
// import toast from 'react-hot-toast';
// import { HCButton } from '@/components/ui/hc-button';
// import { HCIdCard } from '@/components/ui/hc-card';

// const notify = (message: string) => toast(message, {
//   style: {
//     borderRadius: '10px',
//     background: '#333',
//     color: '#fff',
//   }
// })

// export const IndexPage: FC = () => {
//   return (
//     <>
//       <header style={{ position: 'absolute', right: 20, top: 20}}>
//         <TonConnectButton/>
//       </header>
//       <div className="flex h-screen flex-1 flex-col px-6 py-5 lg:px-8">
//         <div className="sm:mx-auto flex-1 sm:w-full sm:max-w-sm mt-10">
//           <h2 className="mt-10 text-center text-5xl font-medium leading-9 tracking-tight text-gray-900 dark:text-gray-200">
//             HumanCode
//           </h2>
//           <p className='text-center mt-5'>Proof-of-personhood,</p>
//           <p className='text-center'>powered by your palm</p>
//           <HCIdCard code='0000 0000 1238 1772 6865' issueDate='09/02/2024' />
//         </div>

//         <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
//           <div className="mt-3">
//             <HCButton idx={1} title='Connect wallet' onClick={() => null} />
//           </div>
//           <div className="mt-3">
//             <HCButton idx={2} title='Prove you are human' onClick={() => null} />
//           </div>
//           <div className="mt-3">
//             <HCButton idx={3} title='Receive airdrop' titleIcon={<img className='ml-2' src={ton} width={20} height={20} />} onClick={() => null} />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };
