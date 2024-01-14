import cx from 'classnames';
import {PageContainer} from '../../components';

import './styles.scss';

const CreateNew: React.FC = () => {
  return (
    <PageContainer className={cx('p-create-new')}>
      <PageContainer.Card className="p-create-new_content" title="Create a new AA Wallet">
        <div>
          <span>0x4C5920A65C90A1babc4C8bC66d2D3aBDD036b834</span>
        </div>
      </PageContainer.Card>
    </PageContainer>
  );
};

export default CreateNew;
