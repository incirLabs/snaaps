import {Link} from 'react-router-dom';
import {Button} from '../Button/Button';
import {Surface} from '../Surface/Surface';
import {Paths} from '../../routes/Paths';
import {useAddToMetamask} from '../../hooks';

import './styles.scss';

export const MySnaapSidebar: React.FC = () => {
  const addToMetamask = useAddToMetamask();

  return (
    <div>
      <Surface className="c-sidebar">
        <Button as={Link} to={Paths.MySnaap.MySnaap} theme="primary" block>
          🎭 MMy SnAAp
        </Button>

        <Button as={Link} to={Paths.MySnaap.Plugins} theme="primary" block>
          🔌 MMy Plugins
        </Button>
      </Surface>

      <div className="p-2">
        <Button theme="primary" block className="px-4" onClick={addToMetamask}>
          🦊 Add To MetaMask
        </Button>
      </div>
    </div>
  );
};
