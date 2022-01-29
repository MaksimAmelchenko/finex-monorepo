import { h, render } from 'preact';

import { App } from './Application';

import './styles/index.css';
import { initializeMainStore } from './core/initialize-stores';
import { createMainContext } from './core/main-context';

import { options } from 'preact';

let old = options.__h;
options.__h = (c, i, type) => {
  if (type === 9) {
    let hooks = c && (c.__H || (c.__H = { __: [], __h: [] })) && c.__H.__;
    if (!hooks[i]) hooks[i] = Object.defineProperty({}, '__c', DESC);
  }
  if (old) old(c, i, type);
};
const DESC = {
  get() {
    return this.c;
  },
  set(v) {
    this.c = typeof v === 'function' ? Object.assign({}, v) : v;
  },
};

// We don't need context provider for this default value
createMainContext(initializeMainStore());

render(<App />, document.body);
