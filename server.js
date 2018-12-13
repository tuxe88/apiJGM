var express = require('express'),
  app = express(),
  port =  4180,
  mongoose = require('mongoose'),
  Task = require('./api/models/rolestackModel'), //created model loading here
  bodyParser = require('body-parser');

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://root:ds3_us3r@localhost/dse_rae');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/rolestackRoutes');
routes(app);

app.listen(port);

console.log('todo list RESTful API server started on: ' + port);