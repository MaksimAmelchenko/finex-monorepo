const { promisify } = require('util');
const stoppable = require('stoppable');

export function gracefulShutdown(server, options) {
  // const { signal = 'SIGINT', onSignal, timeout = 1000, log } = options;
  const { signal = 'SIGTERM', onSignal, timeout = 1000, log } = options;

  stoppable(server, timeout);

  const asyncServerStop = promisify(server.stop).bind(server);

  function cleanup() {
    asyncServerStop()
      .then(() => onSignal())
      .then(() => {
        process.removeListener(signal, cleanup);
        process.kill(process.pid, signal);
      })
      .catch(error => {
        log.fatal('error happened during shutdown', error);
        process.exit(1);
      });
  }

  process.on(signal, cleanup);
}
