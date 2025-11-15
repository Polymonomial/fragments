const options = { levels: process.env.LOG_LEVEL || `info` };
if (options.level === 'test') {
  // https://github.com/pinojs/pino-pretty
  options.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  };
}
module.exports = require('pino')(options);
