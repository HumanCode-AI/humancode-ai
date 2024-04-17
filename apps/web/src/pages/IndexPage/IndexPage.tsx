import './IndexPage.css';

import { useCallback, useEffect, useMemo, useState, type FC } from 'react';
import { TonConnectButton, useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import ton from '../../assets/ton.png'
import { toast as reactToast } from 'react-toastify'
import { HCButton } from '@/components/ui/hc-button';
import { HCIdCard } from '@/components/ui/hc-card';
import { useUtils, useMiniApp, useInitDataRaw, useViewport } from '@tma.js/sdk-react';

export const IndexPage: FC = () => {
  const walletAddress = useTonAddress(true);
  const [ tonConnectUI ] = useTonConnectUI();
  const utils = useUtils();
  const miniapp = useMiniApp();
  const initDataRaw = useInitDataRaw();
  const viewPort = useViewport();

  const [profile, setProfile] = useState<{id: string, isHuman: boolean, address?: string, claimAirdrop?: string, hasAward?: boolean, humanCode?: string, issueDate?: string}>({
    id: '',
    isHuman: false,
    hasAward: false,
  });

  const [loading, setLoading] = useState({
    connectWallet: false,
    verifyHumanCode: false,
    claimAirdrop: false
  });

  const [ctxHasAward, setCtxHasAward] = useState(false);
  
  const humanAuthUrl = useMemo(() => {
    return new URL(`${window.location.origin}/api/v1/auth/humancode/mini/login?address=${walletAddress}&initData=${btoa(initDataRaw ?? '')}`, window.location.href).toString();
  }, [walletAddress]);
  
  const connectWallet = useCallback(() => {
    tonConnectUI.openModal();
  }, [tonConnectUI]);

  const verifyHumanCode = useCallback(() => {
    utils.openLink(humanAuthUrl, false);
    setTimeout(() => {
      miniapp.close()
    }, 0);
  }, [humanAuthUrl]);

  const viewInBlockExplorer = useCallback((res: string) => {
    utils.openLink(`${import.meta.env.VITE_BLOCK_EXPLORER}/transaction/${res}`, false);
  }, [])

  const loadProfile = useCallback(() => {
    fetch(`/api/v1/auth/humancode/mini/me?address=${walletAddress || ''}`, {
      headers: {
        'telegram-init-data': initDataRaw || '',
      },
    })
    .then(res => res.json())
    .then((res) => {
      setProfile(res);
    })
    .catch(err => console.log(err));
  }, [initDataRaw, walletAddress]);

  const claimAirdrop = useCallback(() => {
    setLoading({
      ...loading,
      claimAirdrop: true
    })
    const toast = reactToast.loading('Transaction in progress', { closeOnClick: false });
    fetch(`/api/v1/faucet/take`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        initData: initDataRaw
      })
    })
    .then(res => res.text())
    .then((res) => {
      setProfile({
        ...profile,
        claimAirdrop: res
      });
      reactToast.update(toast, { render: 'View in block explorer', type: 'success', isLoading: false, autoClose: 10000, onClick: () => {
        viewInBlockExplorer(res);
        reactToast.dismiss(toast);
      }});
      setCtxHasAward(true);
    })
    .catch(() => {
      reactToast.update(toast, { render: 'Failed to claim airdrop', type: 'error', isLoading: false, autoClose: 5000 });
    })
    .finally(() => {
      setLoading({
        ...loading,
        claimAirdrop: false
      })
    })
  }, [initDataRaw, profile]);

  useEffect(() => {
    if (walletAddress) {
      loadProfile();
    } else {
      setProfile({
        id: '',
        isHuman: false,
        hasAward: false,
      })
      setCtxHasAward(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    if (!viewPort.isExpanded) {
      setTimeout(() => {
        viewPort.expand();
      }, 200);
    }
  }, [viewPort])

  const receiveAirdropDisabled = !profile.isHuman || !walletAddress || !profile.hasAward || loading.claimAirdrop || ctxHasAward;

  return (
    <>
      <header style={{ position: 'absolute', right: 10, top: 10}}>
        <TonConnectButton/>
      </header>
      <div className={`flex h-screen flex-1 flex-col px-6 lg:px-8 ${window.outerHeight <= 707 ? 'py-5' : 'py-10'}`}>
        <div className="sm:mx-auto flex-1 sm:w-full sm:max-w-sm mt-5">
          <h2 className="mt-10 text-center text-[42px] font-semibold leading-9 tracking-tight text-gray-900 dark:text-gray-200">
            HumanCode
          </h2>
          <p className='text-center mt-5 text-base'>Proof-of-personhood,</p>
          <p className='text-center text-base'>powered by your palm</p>
          <HCIdCard code={profile.humanCode} issueDate={profile.issueDate} />
        </div>

        <div className="mt-1 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="mt-1">
            <HCButton idx={1}
              title='Connect wallet' 
              onClick={connectWallet} 
              disabled={!!walletAddress || profile.isHuman} 
              finished={!!walletAddress || profile.isHuman}/>
          </div>
          <div className="mt-3">
            <HCButton idx={2} 
              title='Prove you are human' 
              onClick={verifyHumanCode} 
              disabled={profile.hasAward || !walletAddress}
              finished={profile.isHuman && profile.hasAward}/>
          </div>
          <div className="mt-3">
            <HCButton idx={3} 
              title='Receive airdrop' 
              titleIcon={<img className={`ml-2 ${receiveAirdropDisabled ? 'opacity-50' : ''}`} src={ton} width={20} height={20} />} 
              onClick={claimAirdrop}
              disabled={receiveAirdropDisabled}
              finished={ctxHasAward}
              loading={loading.claimAirdrop}
            />
          </div>
        </div>
      </div>
    </>
  );
};
