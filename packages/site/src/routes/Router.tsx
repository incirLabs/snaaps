import {Navigate, Route, Routes} from 'react-router-dom';
import {PageLayout, MySnaapPageLayout} from '../components';
import {Paths, PathsStatic} from './Paths';

import Landing from './Landing/Landing';
import Integrate from './Integrate/Integrate';
import CreateNew from './CreateNew/CreateNew';

import MySnaaps from './MySnaaps/MySnaaps';
import Networks from './Networks/Networks';
import MySnaap from './MySnaap/MySnaap';
import PastTxs from './PastTxs/PastTxs';
import Plugins from './Plugins/Plugins';

const Router: React.FC = () => (
  <Routes>
    <Route path={PathsStatic.Landing.Root} element={<PageLayout />}>
      <Route path={PathsStatic.Landing.Landing} element={<Landing />} />
      <Route path={PathsStatic.Landing.Integrate} element={<Integrate />} />
      <Route path={PathsStatic.Landing.CreateNew} element={<CreateNew />} />
    </Route>

    <Route path={PathsStatic.MySnaaps.Root} element={<PageLayout />}>
      <Route path={PathsStatic.MySnaaps.MySnaaps} element={<MySnaaps />} />
      <Route path={PathsStatic.MySnaap.Networks} element={<Networks />} />
    </Route>

    <Route path={PathsStatic.MySnaap.Root} element={<MySnaapPageLayout />}>
      <Route path={PathsStatic.MySnaap.MySnaap} element={<MySnaap />} />
      <Route path={PathsStatic.MySnaap.PastTxs} element={<PastTxs />} />
      <Route path={PathsStatic.MySnaap.Plugins} element={<Plugins />} />
    </Route>

    <Route path="*" element={<Navigate to={Paths.Landing.Root} />} />
  </Routes>
);

export default Router;
