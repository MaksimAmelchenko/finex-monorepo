import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { StrictMode } from 'react';

import { App } from './app/app';
import { createMainContext } from './app/core/main-context';
import { initializeMainStore } from './app/core/initialize-stores';

import * as en from '../locales/en.js';
import { initializeI18n } from './app/lib/core/i18n';

const languages = ['en', 'ru', 'de'];
// const lang = window.location.pathname.split('/')[1];
const lang = languages[0];
const defaultLanguage = languages[0];
const currentLocale = languages.includes(lang) ? lang : defaultLanguage;

async function initI18n(): Promise<void> {
  switch (currentLocale) {
    case 'en': {
      initializeI18n(
        {
          en: {
            ...en,
            date: {
              formats: {
                default: 'MM-dd-yy',
                short: 'MM-dd-yyyy',
              },
            },
            time: {
              formats: {
                short: 'HH:mm',
              },
            },
          },
        },
        currentLocale,
        defaultLanguage
      );
      break;
    }
    case 'ru': {
      const ru = await import(/* webpackChunkName: "locale-ru" */ '../locales/ru.js');
      initializeI18n(
        {
          ru: {
            ...ru,
            date: {
              formats: {
                default: 'dd.MM.yy',
                short: 'dd.MM.yyyy',
              },
            },
            time: {
              formats: {
                short: 'HH:mm',
              },
            },
          },
        },
        currentLocale,
        defaultLanguage
      );
      break;
    }
    case 'de': {
      const de = await import(/* webpackChunkName: "locale-de" */ '../locales/de.js');
      initializeI18n(
        {
          en: {
            ...de,
            date: {
              formats: {
                default: 'dd.MM.yy',
                short: 'dd.MM.yyyy',
              },
            },
            time: {
              formats: {
                short: 'HH:mm',
              },
            },
          },
        },
        currentLocale,
        defaultLanguage
      );
      break;
    }
  }
}

initI18n().then(() => {
  createMainContext(initializeMainStore());

  render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
    document.getElementById('root')
  );
});
