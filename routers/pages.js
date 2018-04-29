var express = require('express');
var pagesRouter = express.Router();
var routes = require('../config/routes');
var methods = require('../config/methods');
var views = require('../config/views');

pagesRouter.get(routes.index_route, (request, response) => {
  response.render(views.index_view, {
    page_title: 'Welcome To NodeJS Learning App',
  });
});

pagesRouter.get(routes.about_route, (request, response) => {
  response.render(views.about_view, {
    page_title: 'About NodeJS Learning App',
  });
});

module.exports = pagesRouter;
