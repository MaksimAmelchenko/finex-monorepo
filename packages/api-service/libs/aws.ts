import * as AWS from 'aws-sdk';
import * as https from 'https';

// AWS.config.update({ region: process.env.AWS_REGION, logger: console });
AWS.config.update({
  region: process.env.AWS_REGION,
  httpOptions: {
    agent: new https.Agent({
      rejectUnauthorized: true,
      keepAlive: true,
    }),
  },
  // logger: { log: console.log },
});

export { AWS };
