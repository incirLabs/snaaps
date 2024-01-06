import {Navigate, Route, Routes} from 'react-router-dom';
import {PageLayout} from '../components';
import {Paths} from './Paths';

import Landing from './Landing/Landing';
import Setup from './Setup/Setup';
import MySnaap from './MySnaap/MySnaap';
import Plugins from './Plugins/Plugins';
import Networks from './Networks/Networks';

const Router: React.FC = () => (
  <Routes>
    <Route path={Paths.Landing.Root} element={<PageLayout />}>
      <Route path={Paths.Landing.Landing} element={<Landing />} />
      <Route path={Paths.Landing.Setup} element={<Setup />} />
    </Route>

    <Route path={Paths.MySnaap.Root} element={<PageLayout />}>
      <Route path={Paths.MySnaap.MySnaap} element={<MySnaap />} />
      <Route path={Paths.MySnaap.Plugins} element={<Plugins />} />
      <Route path={Paths.MySnaap.Networks} element={<Networks />} />
    </Route>

    <Route path="*" element={<Navigate to={Paths.Landing.Root} />} />
  </Routes>
);

export default Router;
