import { h, render } from 'preact';

import { App } from './Application';

import './style/index.css';
import { initializeMainStore } from './core/initialize-stores';
import { createMainContext } from './core/main-context';

// We don't need context provider for this default value
createMainContext(initializeMainStore());

render(<App />, document.body);
