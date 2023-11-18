import {Outlet} from 'react-router-dom';
import {PageContainer} from './PageContainer';
import {Header} from '../Header/Header';
import {MySnaapSidebar} from '../MySnaapSidebar/MySnaapSidebar';

import './styles.scss';

export const PageLayout: React.FC<{children?: React.ReactNode; showSidebar?: boolean}> = ({
  children,
  showSidebar,
}) => {
  return (
    <div className="c-page-layout">
      <PageContainer area="top">
        <Header />
      </PageContainer>

      {showSidebar ? (
        <PageContainer area="left" className="c-page-layout_sidebar">
          <MySnaapSidebar />
        </PageContainer>
      ) : null}

      {children}

      <Outlet />
    </div>
  );
};
