import React from 'react';
import { Helmet } from 'react-helmet';

interface IGoogleAnalyticsProps {
  trackingId: string;
}

export const GoogleAnalytics = React.memo<IGoogleAnalyticsProps>(({ trackingId }) => {
  return (
    <Helmet>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`} />
      <script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${trackingId}');
        `}
      </script>
    </Helmet>
  );
});

GoogleAnalytics.displayName = 'GoogleAnalytics';
