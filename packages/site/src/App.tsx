import Router from './routes/Router';
import {Marquee} from './components';

const App: React.FC = () => {
  return (
    <div className="app">
      <div className="app_warning-banner">
        <Marquee duration={20_000} className="app_warning-banner_content">
          <span>Currently In Beta</span>
          <span>-</span>
          <span>Take Your Risk</span>
          <span>-</span>
        </Marquee>
      </div>

      <div className="container flex-1 d-flex f-dir-col">
        <Router />
      </div>
    </div>
  );
};

export default App;
