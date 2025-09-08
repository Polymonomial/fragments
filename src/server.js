const stoppable = require('stoppable');
const logger = require('./logger');
const app = require('./app');
const port = parseInt(process.env.PORT || '8080', 10);
const server = stoppable(app.listen(port, () =>{logger.info(`Server started on port ${port}`)}));
for (const key in process.env) {
  logger.info(`${key}: ${process.env[key]}`);
}
module.exports = server;