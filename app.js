const app = require('./api/index');
const { ensureDBConnection } = require('./api/index');

module.exports = app;
module.exports.ensureDBConnection = ensureDBConnection;
