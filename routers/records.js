var express = require('express');
var recordsRouter = express.Router();
var routes = require('../config/routes');
var methods = require('../config/methods');
var views = require('../config/views');
var record_validations = require('../models/validations/record');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator/check');

require('../models/Record');
const Record = mongoose.model('records');

recordsRouter.get(routes.new_record_route, (request, response) => {
  response.render(views.new_record_view, {
    page_title: 'New Record',
    action: routes.create_record_route,
    method: methods.post,
  });
});

recordsRouter.get(routes.edit_record_route, (request, response) => {
  Record.findOne({
    _id: request.params.id
  }).then(record => {
    response.render(views.edit_record_view, {
      page_title: 'Edit Record',
      action: [routes.update_record_route.replace(':id', record.id), "_method=PUT"].join('?'),
      method: methods.post,
      title: record.title,
      details: record.details,
      overrideMethod: 'PUT',
    });
  }).catch(error => {
    response.redirect(routes.records_index_route);
  });
});

recordsRouter.get(routes.records_index_route, (request, response) => {
  Record.find({}).sort({
    created_at: 'desc'
  }).then(records => {
    response.render(views.records_index_view, {
      page_title: 'Records',
      records: records,
    });
  });
});

recordsRouter.post(
  routes.create_record_route,
  record_validations,
  (request, response, next) => {
    const errors = validationResult(request);
    const newRecord = {
      title: request.body.title,
      details: request.body.details,
    };
    const failure_body = Object.assign(newRecord, {
      page_title: 'Add New Record',
      method: methods.post,
      action: routes.create_record_route
    });

    if (!errors.isEmpty()) {
      return response.render(views.new_record_view, Object.assign(failure_body, {errors: errors.mapped()}));
    } else {
      new Record(newRecord)
        .save()
        .then(record => {
          response.redirect(routes.records_index_route);
        })
        .catch(error => {
          response.render(views.new_record_view, failure_body);
      });
    }
  }
);

recordsRouter.put(
  routes.update_record_route,
  record_validations,
  (request, response, next) => {
    const errors = validationResult(request);
    const failure_body = {
      page_title: 'Edit Record',
      action: [routes.update_record_route.replace(':id', request.params.id), "_method=PUT"].join('?'),
      method: methods.post,
      title: request.body.title,
      details: request.body.details,
      overrideMethod: 'PUT',
    };

    if (!errors.isEmpty()) {
      return response.render(views.edit_record_view, Object.assign(failure_body, {errors: errors.mapped()}));
    } else {
      Record.findOne({
        _id: request.params.id
      }).then(record => {
        record.title = request.body.title,
        record.details = request.body.details,
        record.save().then(record => {
          response.redirect(routes.records_index_route);
        }).catch(error => {
          response.render(views.edit_record_view, failure_body);
        });
      }).catch(error => {
        response.render(views.edit_record_view, failure_body);
      })
    }
  }
);

recordsRouter.delete(
  routes.destroy_record_route,
  (request, response, next) => {
    Record.remove({
      _id: request.params.id
    })
    .then(() => {
      response.redirect(routes.records_index_route);
    })
    .catch(() => {
      response.redirect(routes.records_index_route);
    });
  }
);

module.exports = recordsRouter;
