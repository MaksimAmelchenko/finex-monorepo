// https://developers.google.com/tag-platform/gtagjs/reference/events#parameters_15
interface IPageViewParams extends Record<string, string | number | undefined> {
  page_location?: string;
  client_id?: string;
  language?: string;
  page_encoding?: string;
  page_title?: string;
  user_agent?: string;
}

function event(name: string, params: Record<string, string | number | undefined>): void {
  if (window.gtag) {
    window.gtag('event', name, params);
  } else {
    console.log('event', name, params);
  }
}

function view(params: IPageViewParams): void {
  event('page_view', params);
}

interface IOptions {
  trackingId: string;
}

function addGoogleAnalytics({ trackingId }: IOptions) {
  return new Promise((resolve, reject) => {
    if (window.GDPRCookiesGoogleAnalyticsAdded) {
      return resolve(true);
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.onload = () => {
      window.GDPRCookiesGoogleAnalyticsAdded = true;
      resolve(true);
    };
    script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    script.async = true;
    document.head.appendChild(script);
  });
}

function initializeGoogleAnalytics({ trackingId }: IOptions) {
  if (!window.GDPRCookiesGoogleAnalyticsInitialized) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', trackingId);

    window.GDPRCookiesGoogleAnalyticsInitialized = true;
  }
}

function initializeAndTrack(options: IOptions) {
  const gdprCookieConsent = localStorage.getItem('gdpr_cookie_consent');

  if (gdprCookieConsent && gdprCookieConsent === 'accepted') {
    addGoogleAnalytics(options).then(status => {
      if (status) {
        initializeGoogleAnalytics(options);
      }
    });
  }
}

export const analytics = {
  event,
  view,
  initializeAndTrack,
};
