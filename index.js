const app = require('express')();
const mongoose = require('mongoose');
const { Types } = require('mongoose');
require('./app/models');
const config = require('./config');

config.express(app);
config.routes(app);
const { appPORT, mongoUri } = config.app

mongoose.connect(mongoUri).then(() => {
    console.log('database connect success!!');
});

app.listen(appPORT, () => {
    console.log(`server is listening on port ${appPORT}`);
});