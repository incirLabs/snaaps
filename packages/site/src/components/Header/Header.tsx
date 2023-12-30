import {Button} from '../Button/Button';

import {LogoSquare} from '../../assets/LogoSquare';

import './styles.scss';

export const Header: React.FC = () => {
  const connected = false;

  return (
    <div className="c-header">
      <h1 className="c-header_logo">
        <LogoSquare width={32} height={32} className="me-3" />
        snAAps
      </h1>

      {connected ? (
        <Button theme="chip" className="c-header_connected-button">
          Connected 🦊
        </Button>
      ) : null}
    </div>
  );
};
