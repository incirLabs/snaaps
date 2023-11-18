import {Outlet} from 'react-router-dom';
import {PageContainer} from './PageContainer';
import {Header} from '../Header/Header';

import './styles.scss';

export const PageLayout: React.FC<{children?: React.ReactNode}> = ({children}) => {
  return (
    <div className="c-page-layout">
      <PageContainer area="top">
        <Header />
      </PageContainer>

      {children}

      <Outlet />
    </div>
  );
};
