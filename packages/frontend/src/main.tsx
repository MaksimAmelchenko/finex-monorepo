import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { StrictMode } from 'react';

import { App } from './app/app';
import { createMainContext } from './app/core/main-context';
import { initializeMainStore } from './app/core/initialize-stores';

createMainContext(initializeMainStore());

render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
  document.getElementById('root')
);
