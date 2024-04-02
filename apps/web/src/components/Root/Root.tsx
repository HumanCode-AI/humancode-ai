import { setDebug } from '@tma.js/sdk';
import { DisplayGate, SDKProvider } from '@tma.js/sdk-react';
import { THEME, TonConnectUIProvider } from '@tonconnect/ui-react';
import type { FC } from 'react';
import { useEffect, useMemo } from 'react';
// import { Toaster } from 'react-hot-toast';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { App } from '../App';

const Err: FC<{ error: unknown }> = ({ error }) => {
  return (
    <div>
      <p>Please open it in the Telegram application</p>
      <blockquote>
        <code>
          {error instanceof Error
            ? error.message
            : JSON.stringify(error)}
        </code>
      </blockquote>
    </div>
  );
};

const Loading: FC = () => {
  return (
    <div>Application is loading</div>
  );
};

export const Root: FC = () => {
  const manifestUrl = useMemo(() => {
    return new URL('tonconnect-manifest.json', window.location.href).toString();
  }, []);

  // Enable debug mode to see all the methods sent and events received.
  useEffect(() => {
    setDebug(true);
  }, []);

  return (
    <TonConnectUIProvider 
      manifestUrl={manifestUrl}
      uiPreferences={{ theme: THEME.DARK }}
      actionsConfiguration={{ twaReturnUrl: 'https://t.me/uhumancodeai_bot/app' }}
    >
      <SDKProvider options={{ acceptCustomStyles: true, cssVars: true, complete: true }}>
        <DisplayGate error={Err} loading={Loading} initial={Loading}>
          <App />
          {/* <Toaster/> */}
          <ToastContainer
            position="top-center"
            bodyStyle={{ justifyContent: 'center' }}
            autoClose={10000}
            hideProgressBar={false}
            newestOnTop={false}
            // closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </DisplayGate>
      </SDKProvider>
    </TonConnectUIProvider>
  );
};
