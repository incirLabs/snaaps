import {StrictMode, useRef} from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
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
        <App />
      </BrowserRouter>
    </StrictMode>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as unknown as HTMLElement);

root.render(<Root />);
