import {Fragment} from 'react';
import Router from './routes/Router';

const App: React.FC = () => {
  return (
    <div className="app">
      <div className="app_warning-banner">
        <div className="app_warning-banner_content">
          {Array.from({length: 20}).map((_, index) => (
            <Fragment key={index.toString()}>
              <span>Currently In Beta</span>
              <span>-</span>
              <span>Take Your Risk</span>
              <span>-</span>
            </Fragment>
          ))}
        </div>
      </div>

      <Router />
    </div>
  );
};

export default App;
