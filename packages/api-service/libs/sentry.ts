import * as Sentry from '@sentry/node';
import { SeverityLevel } from '@sentry/types';

Sentry.init({
  //
  // The DSN tells the SDK where to send the events. If this value is not provided,
  // the SDK will try to read it from the SENTRY_DSN environment variable.
  // If that variable also does not exist, the SDK will just not send any events.
  //
  environment: process.env.NODE_ENV,
  release: process.env.npm_package_version,

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

export function sentryErrorHandler(err: Error, ctx) {
  Sentry.withScope(scope => {
    scope.setSDKProcessingMetadata({ request: ctx.request });
    Sentry.captureException(err);
  });
}

export function captureMessage(message: string, level: SeverityLevel = 'info') {
  Sentry.captureMessage(message, level);
}
