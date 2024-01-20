import {StrictMode} from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {Web3Providers} from './Web3Providers';
import {SnapAccountsProvider} from './hooks';
import App from './App';

import './bootstrap.scss';
import '@csstools/normalize.css';
import './styles/all.scss';
import './index.scss';

const queryClient = new QueryClient();

const Root: React.FC = () => {
  return (
    <StrictMode>
      <BrowserRouter>
        <Web3Providers>
          <SnapAccountsProvider>
            <QueryClientProvider client={queryClient}>
              <App />
            </QueryClientProvider>
          </SnapAccountsProvider>
        </Web3Providers>
      </BrowserRouter>
    </StrictMode>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as unknown as HTMLElement);

root.render(<Root />);
