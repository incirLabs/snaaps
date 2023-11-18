import {StrictMode} from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import {Web3Providers} from './Web3Providers';
import App from './App';

import 'bootstrap/scss/bootstrap-grid.scss';
import 'bootstrap/scss/bootstrap-utilities.scss';
import '@csstools/normalize.css';
import './styles/all.scss';
import './index.scss';

const Root: React.FC = () => {
  return (
    <StrictMode>
      <BrowserRouter>
        <Web3Providers>
          <App />
        </Web3Providers>
      </BrowserRouter>
    </StrictMode>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as unknown as HTMLElement);

root.render(<Root />);
