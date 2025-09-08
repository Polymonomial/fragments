# fragments
This repo is for the BTI525 course. This will serve as the main branch for all future labs and assignments.

How to run lint: run "npm init @eslint/config@latest" to install latest version of lint
                 Go through each prompt options depending on your needs.
                 A eslint.config.mjs file will be created if every thing is done correctly.
                 Include a lint script in package.json to apply lint to all js file within root.
                 use npm run lint to check for errors

How to run Prettier: run "npm install --save-dev --save-exact prettier" to install
                     setup a .prettierrc config fire in root.
                     create a .prettierignore file to ignore node_module and package.json

How to npm start: add "start": "node src/server.js" under script in package.json to use npm start

How to npm run dev: add "dev": "node --env-file=debug.env --watch ./src/server.js" under script in package.json to use npm run dev

How to npm run debug: add "debug": "node --env-file=debug.env --inspect=0.0.0.0:9229 --watch ./src/server.js" under script in package.json to use npm run debug for debugging

CURL: curl -s localhost:8080 | jq for more tidier logging

Cors, helmet and compression: Cors is for crossweb applications can access resources from a different origin, such as a different domain, scheme, or port. Helmet is for security and compression is basically zip/rar

Code block template for express app"

#############################################################################################################################################################################################################################
// src/app.js

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

// author and version from our package.json file
// TODO: make sure you have updated your name in the `author` section
const { author, version } = require('../package.json');

const logger = require('./logger');
const pino = require('pino-http')({
  // Use our default logger instance, which is already configured
  logger,
});

// Create an express app instance we can use to attach middleware and HTTP routes
const app = express();

// Use pino logging middleware
app.use(pino);

// Use helmetjs security middleware
app.use(helmet());

// Use CORS middleware so we can make requests across origins
app.use(cors());

// Use gzip/deflate compression middleware
app.use(compression());

// Define a simple health check route. If the server is running
// we'll respond with a 200 OK.  If not, the server isn't healthy.
app.get('/', (req, res) => {
  // Clients shouldn't cache this response (always request it fresh)
  // See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching#controlling_caching
  res.setHeader('Cache-Control', 'no-cache');

  // Send a 200 'OK' response with info about our repo
  res.status(200).json({
    status: 'ok',
    author,
    // TODO: change this to use your GitHub username!
    githubUrl: 'https://github.com/REPLACE_WITH_YOUR_GITHUB_USERNAME/fragments',
    version,
  });
});

// Add 404 middleware to handle any requests for resources that can't be found
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    error: {
      message: 'not found',
      code: 404,
    },
  });
});

// Add error-handling middleware to deal with anything else
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // We may already have an error response we can use, but if not,
  // use a generic `500` server error and message.
  const status = err.status || 500;
  const message = err.message || 'unable to process request';

  // If this is a server error, log something so we can see what's going on.
  if (status > 499) {
    logger.error({ err }, `Error processing request`);
  }

  res.status(status).json({
    status: 'error',
    error: {
      message,
      code: status,
    },
  });
});

// Export our `app` so we can access it in server.js
module.exports = app;
#############################################################################################################################################################################################################################

express server template:
#############################################################################################################################################################################################################################
// src/server.js

// We want to gracefully shutdown our server
const stoppable = require('stoppable');

// Get our logger instance
const logger = require('./logger');

// Get our express app instance
const app = require('./app');

// Get the desired port from the process' environment. Default to `8080`
const port = parseInt(process.env.PORT || '8080', 10);

// Start a server listening on this port
const server = stoppable(
  app.listen(port, () => {
    // Log a message that the server has started, and which port it's using.
    logger.info(`Server started on port ${port}`);
  })
);

// Export our server instance so other parts of our code can access it if necessary.
module.exports = server;
#############################################################################################################################################################################################################################


