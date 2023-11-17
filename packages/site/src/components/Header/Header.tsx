import {Button} from '../Button/Button';

import './styles.scss';

export const Header: React.FC = () => {
  const connected = false;

  return (
    <div className="c-header">
      <h1 className="c-header_logo">SnAAps 😸</h1>

      {connected ? (
        <Button theme="chip" className="c-header_connected-button">
          Connected 🦊
        </Button>
      ) : null}
    </div>
  );
};
