import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import { BrowserRouter } from 'react-router-dom';
import { BrowserTracing } from '@sentry/tracing';

import { App } from './app/app';
import { Locale } from './app/types';
import { createMainContext } from './app/core/main-context';
import { initializeI18n } from './app/lib/core/i18n';
import { initializeMainStore } from './app/core/initialize-stores';

import * as en from '../locales/en.js';

const locales = [Locale.En, Locale.Ru, Locale.De];

const searchParams = new URLSearchParams(window.location.search);
const locale: Locale | null = searchParams.get('locale') as Locale;

// TODO use localStorage to save default locale
const defaultLocale = locales[0] as Locale;
const currentLocale: Locale = locale && locales.includes(locale) ? locale : defaultLocale;

const SENTRY_DSN = process.env.NX_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
  });
}

async function initI18n(): Promise<void> {
  switch (currentLocale) {
    case 'en': {
      initializeI18n(
        {
          en: {
            ...en,
            date: {
              formats: {
                default: 'dd.MM.yyyy',
                short: 'dd.MM.yy',
                month: 'MMM YYYY',
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
        defaultLocale
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
                default: 'dd.MM.yyyy',
                short: 'dd.MM.yy',
                month: 'MMM yyyy',
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
        defaultLocale
      );
      break;
    }
    case 'de': {
      const de = await import(/* webpackChunkName: "locale-de" */ '../locales/de.js');
      initializeI18n(
        {
          de: {
            ...de,
            date: {
              formats: {
                default: 'dd.MM.yyyy',
                short: 'dd.MM.yy',
                month: 'MMM yyyy',
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
        defaultLocale
      );
      break;
    }
  }
}

initI18n().then(() => {
  createMainContext(initializeMainStore());
  const root = ReactDOM.createRoot(document.getElementById('root')!);

  root.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
});
