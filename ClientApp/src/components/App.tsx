import * as React from 'react';
import { Home } from './Home';
import { LeisureCenterProvider } from '../shared/leisurecenter/LeisureCenterProvider';
import { GlobalStyle } from '../styling/GlobalStyle';

export const App = () => {
  return (
    <div>
      <GlobalStyle />
      <LeisureCenterProvider>
        <Home />
      </LeisureCenterProvider>
    </div>
  );
};
