import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { StrictMode } from 'react';

import { App } from './app/app';
import { createMainContext } from './app/core/main-context';
import { initializeMainStore } from './app/core/initialize-stores';

import * as ru from '../locales/ru.js';
import { initializeI18n } from './app/lib/core/i18n';

const languages = ['ru', 'en', 'de'];
// const lang = window.location.pathname.split('/')[1];
const lang = languages[0];
const defaultLanguage = languages[0];
const currentLocale = languages.includes(lang) ? lang : defaultLanguage;

async function initI18n(): Promise<void> {
  switch (currentLocale) {
    case 'ru': {
      initializeI18n(
        {
          ru: {
            ...ru,
            date: {
              week: { short: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'] },
              formats: {
                short: 'd MMM yyyy',
              },
            },
            time: {
              format: 'HH:mm',
            },
          },
        },
        currentLocale,
        defaultLanguage
      );
      break;
    }
    case 'en': {
      const en = await import(/* webpackChunkName: "locale-en" */ '../locales/en.js');
      initializeI18n(
        {
          en: {
            ...en,
            date: {
              week: { short: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
              formats: {
                short: 'd MMM yyyy',
              },
            },
            time: {
              format: 'HH:mm',
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
              week: { short: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
              formats: {
                short: 'd MMM yyyy',
              },
            },
            time: {
              format: 'HH:mm',
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
