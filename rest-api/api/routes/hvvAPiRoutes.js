'use strict';
module.exports = function(app) {
  var hvvAPI = require('../controllers/hvvApiController');

  // hvvAPI Routes
  app.route('/v1/getAddress/:Seed')
    .get(hvvAPI.getAddress);
  app.route('/v1/getData/')
    .post(hvvAPI.getData);

  app.route('/v1/postData/')
    .post(hvvAPI.postData);
};
