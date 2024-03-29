import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { App } from './app/app';
import { Locale } from './app/types';
import { createMainContext } from './app/core/main-context';
import { initializeI18n } from './app/lib/core/i18n';
import { initializeMainStore } from './app/core/initialize-stores';

import * as en from '../locales/en.js';

const locales = [Locale.Ru, Locale.En, Locale.De];

const searchParams = new URLSearchParams(window.location.search);
const locale = searchParams.get('locale') as Locale | null;

const defaultLocale = 'en';
const currentLocale: Locale =
  locale && locales.includes(locale) ? locale : (window.localStorage.getItem('locale') as Locale) ?? locales[0];

window.localStorage.setItem('locale', currentLocale);

async function initI18n(): Promise<void> {
  switch (currentLocale) {
    case 'en': {
      initializeI18n(
        {
          en: {
            ...en,
            number: {
              format: {
                precision: 2,
                separator: '.',
                delimiter: ',',
                strip_insignificant_zeros: false,
              },
              percentage: { format: {} },
              currency: {
                format: {
                  unit: '$',
                  precision: 2,
                  format: '%u%n',
                  delimiter: ',',
                  separator: '.',
                  strip_insignificant_zeros: true,
                },
              },
            },
            date: {
              format: {
                default: 'dd.MM.yyyy',
                full: 'dd.MM.yyyy HH:mm',
                short: 'dd.MM.yy',
                month: 'MMM yyyy',
                // 4 March 2023, Sa
                fullDateWithDayOfWeek: 'd MMMM yyyy, EEEEEE',
              },
            },
            time: {
              format: {
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
            number: {
              format: {
                precision: 2,
                separator: '.',
                delimiter: ' ',
                strip_insignificant_zeros: false,
              },
              percentage: { format: {} },
              currency: {
                format: {
                  unit: '₽',
                  precision: 2,
                  format: '%n %u',
                  delimiter: ' ',
                  separator: ',',
                  strip_insignificant_zeros: true,
                },
              },
            },
            date: {
              format: {
                default: 'dd.MM.yyyy',
                full: 'dd.MM.yyyy HH:mm',
                short: 'dd.MM.yy',
                month: 'MMM yyyy',
                // 4 марта 2023, сб
                fullDateWithDayOfWeek: 'd MMMM yyyy, EEEEEE',
              },
            },
            time: {
              format: {
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
            number: {
              format: {
                precision: 2,
                separator: '.',
                delimiter: ',',
                strip_insignificant_zeros: false,
              },
              percentage: { format: {} },
              currency: {
                format: {
                  unit: '€',
                  precision: 2,
                  format: '%n %u',
                  delimiter: ',',
                  separator: '.',
                  strip_insignificant_zeros: true,
                },
              },
            },
            date: {
              format: {
                default: 'dd.MM.yyyy',
                full: 'dd.MM.yyyy HH:mm',
                short: 'dd.MM.yy',
                month: 'MMM yyyy',
                // 4 März 2023, Sa
                fullDateWithDayOfWeek: 'd MMMM yyyy, EEEEEE',
              },
            },
            time: {
              format: {
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
