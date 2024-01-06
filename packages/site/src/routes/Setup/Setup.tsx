import cx from 'classnames';
import {Button, Surface, PageContainer} from '../../components';

import './styles.scss';

const Setup: React.FC = () => {
  return (
    <PageContainer area="center" className={cx('p-setup')}>
      <Surface className="p-setup_content">
        <Button theme="chip">+ Create and deploy a new AA signer</Button>
      </Surface>
    </PageContainer>
  );
};

export default Setup;
