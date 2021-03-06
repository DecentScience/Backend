var express = require('express'),
  app = express(),
  port = process.env.PORT || 3003,
  bodyParser = require('body-parser');
  forge = require('node-forge');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/hvvAPiRoutes');
routes(app);

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});


app.listen(port);


console.log('hvvAPI RESTful API server started on: ' + port);
