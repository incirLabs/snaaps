import {Link} from 'react-router-dom';

import {LogoSquare} from '../../assets/LogoSquare';

import './styles.scss';

export type HeaderProps = {
  right?: React.ReactNode;
};

export const Header: React.FC<HeaderProps> = (props) => {
  const {right} = props;

  return (
    <div className="c-header">
      <Link className="c-header_logo" to="/">
        <LogoSquare width={32} height={32} className="me-3" />
        snAAps
      </Link>

      {right}
    </div>
  );
};
