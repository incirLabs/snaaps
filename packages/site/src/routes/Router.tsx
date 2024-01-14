import {Navigate, Route, Routes} from 'react-router-dom';
import {PageLayout} from '../components';
import {Paths, PathsStatic} from './Paths';

import Landing from './Landing/Landing';
import Integrate from './Integrate/Integrate';
import CreateNew from './CreateNew/CreateNew';
import MySnaap from './MySnaap/MySnaap';
import Plugins from './Plugins/Plugins';
import Networks from './Networks/Networks';

const Router: React.FC = () => (
  <Routes>
    <Route path={PathsStatic.Landing.Root} element={<PageLayout />}>
      <Route path={PathsStatic.Landing.Landing} element={<Landing />} />
      <Route path={PathsStatic.Landing.Integrate} element={<Integrate />} />
      <Route path={PathsStatic.Landing.CreateNew} element={<CreateNew />} />
    </Route>

    <Route path={PathsStatic.MySnaaps.Root} element={<PageLayout />}>
      <Route path={PathsStatic.MySnaap.MySnaap} element={<MySnaap />} />
      <Route path={PathsStatic.MySnaap.Plugins} element={<Plugins />} />
      <Route path={PathsStatic.MySnaap.Networks} element={<Networks />} />
    </Route>

    <Route path="*" element={<Navigate to={Paths.Landing.Root} />} />
  </Routes>
);

export default Router;
