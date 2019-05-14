'use strict'
const app = require('./app')
app.listen(global.gConfig.node_server_port, () => {
    console.log(`${global.gConfig.app_name} listening on port ${global.gConfig.node_server_port}`);
  });