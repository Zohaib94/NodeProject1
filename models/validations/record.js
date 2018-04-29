const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

const record_validations = [
  check('title').trim().isLength({ min: 6, max: 100 }).withMessage('must be between 6 to 100 characters'),
  check('details').trim().isLength({ min: 10, max: 200 }).withMessage('must be between 10 to 200 characters'),
];

module.exports = record_validations;
