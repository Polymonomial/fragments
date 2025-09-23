const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const passport = require('passport');
const authenticate = require('./auth');

//const {author, version } = require('../package.json');

const logger = require('./logger');
const { createErrorResponse } = require('./response');
const pino = require('pino-http')({ logger });

const app = express();

app.use(pino);
app.use(helmet());
app.use(cors());
app.use(compression());

// app.get('/', (req, res) => {
//   res.setHeader('Cache-Control', 'no-cache');
//   res.status(200).json({ status: 'ok', author, githuburl: 'https://github.com/Polymonomial/fragments.git', version });
// });

app.use('/', require('./routes'));
app.use(compression());
passport.use(authenticate.strategy());
app.use(passport.initialize());
app.use('/', require('./routes'));
app.use((req, res) => {
  res.status(404).json({ status: 'error', error: { code: 404, message: 'Not Found' } });
});

app.use((err, req, res) => {
  const status = err.status || 500;
  const message = err.message || 'Unable to process request';
  if (status > 499) {
    logger.error({ err }, `Error processing request`);
  }

  res.status(status).json(
    createErrorResponse({
      status,
      message,
    })
  );
});

module.exports = app;
