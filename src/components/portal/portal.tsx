import React from 'react';
import PortalHost, { PortalContext, PortalMethods } from './portalHost';
import PortalConsumer from './portalConsumer';

type Props = {
  children: React.ReactNode;
};

export default class Portal extends React.Component<Props> {
  // @component ./PortalHost.tsx
  static Host = PortalHost;

  render() {
    const { children } = this.props;

    return (
      <PortalContext.Consumer>
        {(manager) => (
          <PortalConsumer manager={manager as PortalMethods}>
            {children}
          </PortalConsumer>
        )}
      </PortalContext.Consumer>
    );
  }
}
