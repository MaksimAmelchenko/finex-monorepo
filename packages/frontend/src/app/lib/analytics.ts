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

export const analytics = {
  event,
  view,
};
