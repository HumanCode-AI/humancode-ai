// import './IndexPage.css';

// import { useCallback, type FC, useMemo, useState, useEffect } from 'react';
// import { useTonAddress, TonConnectButton, useTonConnectUI } from "@tonconnect/ui-react";
// import { ReloadIcon, CheckIcon, RocketIcon } from "@radix-ui/react-icons"
// import logo from '../../assets/logo.svg'
// import { Button } from '../../components/ui/button'
// import { useUtils, useMiniApp, useInitDataRaw, useViewport } from '@tma.js/sdk-react'
// import toast from 'react-hot-toast';

// const notify = (message: string) => toast(message, {
//   style: {
//     borderRadius: '10px',
//     background: '#333',
//     color: '#fff',
//   }
// })

// export const IndexPage: FC = () => {
//   const walletAddress = useTonAddress(true);
//   const [ tonConnectUI ] = useTonConnectUI();
//   const utils = useUtils();
//   const miniapp = useMiniApp();
//   // const initData = useInitData();
//   const initDataRaw = useInitDataRaw();
//   const v = useViewport();

//   const [profile, setProfile] = useState<{id: string, isHuman: boolean, address?: string, claimAirdrop?: string, hasAward?: boolean}>({
//     id: '',
//     isHuman: false,
//     hasAward: false
//   });

//   const [loading, setLoading] = useState({
//     connectWallet: false,
//     verifyHumanCode: false,
//     claimAirdrop: false
//   });
  
//   const humanAuthUrl = useMemo(() => {
//     return new URL(`${window.location.origin}/api/v1/auth/humancode/mini/login?address=${walletAddress}&initData=${btoa(initDataRaw ?? '')}`, window.location.href).toString();
//   }, [walletAddress]);
  
//   const connectWallet = useCallback(() => {
//     tonConnectUI.openModal();
//   }, [tonConnectUI]);

//   const verifyHumanCode = useCallback(() => {
//     utils.openLink(humanAuthUrl, false);
//     setTimeout(() => {
//       miniapp.close()
//     }, 0);
//   }, [humanAuthUrl]);

//   const viewInBlockExplorer = useCallback(() => {
//     utils.openLink(`https://testnet.tonviewer.com/transaction/${profile.claimAirdrop}`, false);
//   }, [profile])

//   const loadProfile = useCallback(() => {
//     fetch(`/api/v1/auth/humancode/mini/me?address=${walletAddress || ''}`, {
//       headers: {
//         'telegram-init-data': initDataRaw || '',
//       },
//     })
//     .then(res => res.json())
//     .then((res) => {
//       setProfile(res);
//     })
//     .catch(err => console.log(err));
//   }, [initDataRaw, walletAddress]);

//   const claimAirdrop = useCallback(() => {
//     setLoading({
//       ...loading,
//       claimAirdrop: true
//     })

//     fetch(`/api/v1/faucet/take`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         initData: initDataRaw
//       })
//     })
//     .then(res => res.text())
//     .then((res) => {
//       notify('Successfully claimed airdrop');
//       setProfile({
//         ...profile,
//         claimAirdrop: res
//       });
//     })
//     .catch(() => notify('Failed to claim airdrop'))
//     .finally(() => {
//       setLoading({
//         ...loading,
//         claimAirdrop: false
//       })
//     })
//   }, [initDataRaw, profile]);

//   useEffect(() => {
//     if (walletAddress) {
//       loadProfile();
//     } else {
//       setProfile({
//         id: '',
//         isHuman: false,
//       })
//     }
//   }, [walletAddress]);

//   useEffect(() => {
//     if (!v.isExpanded) {
//       v.expand();
//     }
//   }, [v])

//   return (
//     <>
//       <header style={{ position: 'absolute', right: 20, top: 20}}>
//         {walletAddress && (
//           <TonConnectButton/>
//         )}
//       </header>
//       <div className="flex h-screen flex-1 flex-col px-6 py-12 lg:px-8">
//         <div className="sm:mx-auto flex-1 sm:w-full sm:max-w-sm mt-10">
//           <img
//             className="mx-auto h-20 w-auto"
//             src={logo}
//             alt="HumanCode"
//           />
//           <h2 className="mt-10 text-center text-2xl font-medium leading-9 tracking-tight text-gray-900 dark:text-gray-200">
//           HumanCode
//           </h2>
//         </div>

//         <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
//           <p className="m-5 text-center text-sm text-gray-800 dark:text-gray-200">
//             Steps to claim Airdrop
//           </p>
//           <div className="mt-3">
//             <div>
//               <Button size={'lg'} disabled={!!walletAddress || profile.isHuman} className="w-full justify-start" onClick={connectWallet}>
//                 <span>1. Connect Wallet</span> { (walletAddress || profile.isHuman) && <CheckIcon className='ml-2 size-5' color='green' /> }
//               </Button>
//             </div>
//           </div>
//           <div className="mt-3">
//             <div>
//               <Button size={'lg'} disabled={!profile.hasAward || !walletAddress} className="w-full justify-start" onClick={verifyHumanCode}>
//                 <span>2. HumanCode Verification</span> { profile.isHuman && <CheckIcon className='ml-2 size-5' color='green' /> }
//               </Button>
//             </div>
//           </div>
//           <div className="mt-3">
//             <div>
//               {!!profile.claimAirdrop && !profile.hasAward ? (
//                 <Button size={'lg'} className="w-full justify-start" onClick={viewInBlockExplorer}>
//                   <><span>3. View in block explorer</span> <RocketIcon className='ml-2 size-5' color='green' /></>
//                 </Button>
//               ) : (
//                 <Button size={'lg'} disabled={!!profile.claimAirdrop || !profile.isHuman || !walletAddress || !profile.hasAward} className="w-full justify-start" onClick={loading.claimAirdrop ? undefined : claimAirdrop}>
//                   {loading.claimAirdrop ? <><ReloadIcon className='mr-2 animate-spin'/> <span>Loading...</span></> : (
//                     <><span>3. Claim Airdrop</span></>
//                   )}
//                 </Button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };
