import {Link} from 'react-router-dom';
import {Button} from '../Button/Button';
import {Surface} from '../Surface/Surface';
import {Divider} from '../Divider/Divider';
import {Paths} from '../../routes/Paths';

import './styles.scss';

export const MySnaapSidebar: React.FC = () => {
  return (
    <div>
      <Surface className="c-sidebar">
        <Button as={Link} to={Paths.MySnaap.MySnaap} theme="primary" block>
          🎭 MMy SnAAp
        </Button>

        <Button as={Link} to={Paths.MySnaap.Plugins} theme="primary" block>
          🔌 MMy Plugins
        </Button>

        <Divider />

        <Button as={Link} to={Paths.MySnaap.MySnaap} theme="primary" block>
          ⏳ Pending TXs
        </Button>
      </Surface>

      <div className="p-2">
        <Button theme="primary" block className="px-4">
          🦊 Add To MetaMask
        </Button>
      </div>
    </div>
  );
};
