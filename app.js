const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const util = require('util');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var recordsRouter = require('./routers/records');
var pagesRouter = require('./routers/pages');
const port = 3000;
const app = express();

app.engine('handlebars', exphbs({
  defaultLayout: 'main',
}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use('/', recordsRouter);
app.use('/', pagesRouter);

mongoose.connect('mongodb://localhost/nodejs-learning-development')
  .then(() => console.log('MongoDB Connected'))
  .catch((error) => console.log(error));

app.listen(port, () => {
  console.log('Listening on port 3000...')
})
