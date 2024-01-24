import {memo} from 'react';
import {Button, Marquee} from '../../components';

import {NetworksLogos} from '../../assets/NetworksLogos';

export const NetworksMarquee = memo(() => {
  return (
    <Marquee duration={40_000} reversed className="p-landing_networks_content">
      {Object.entries(NetworksLogos).map(([key, logo]) => (
        <Button key={key} theme="chip" as="div">
          <logo.wide.component height={logo.wide.preferredHeight} />
        </Button>
      ))}
    </Marquee>
  );
});
