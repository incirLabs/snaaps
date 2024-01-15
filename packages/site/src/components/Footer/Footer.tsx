import {GithubLogo} from '../../assets/Icons/GithubLogo';
import {XLogo} from '../../assets/Icons/XLogo';
import {EmailIcon} from '../../assets/Icons/EmailIcon';

import './styles.scss';

export const Footer: React.FC = () => {
  return (
    <div className="c-footer">
      <a href="https://github.com/incirLabs/snaaps">
        <GithubLogo width={32} />
      </a>

      <a href="https://x.com">
        <XLogo width={32} />
      </a>

      <a href="mailto:contact@ugureren.net">
        <EmailIcon width={32} />
      </a>
    </div>
  );
};
