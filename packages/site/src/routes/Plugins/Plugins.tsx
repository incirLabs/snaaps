import cx from 'classnames';
import {PluginsItem} from './PluginsItem';
import {Button, PageContainer} from '../../components';

import './styles.scss';

const Plugins: React.FC = () => {
  return (
    <PageContainer className={cx('p-plugins')}>
      <PageContainer.Card
        title="🔌  Plugins"
        titleRight={<Button theme="text">➕ Submit Your AA Plugin</Button>}
      >
        <div className="p-plugins_list">
          <PluginsItem name="🔄 My Subscriptions" />
          <PluginsItem name="🍃 Unicef" />
          <PluginsItem name="🍃 Unicef" />
        </div>
      </PageContainer.Card>
    </PageContainer>
  );
};

export default Plugins;
