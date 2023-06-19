const model = require('../models/tourModel');

exports.schemaArr = Object.keys(model.schema.obj);
exports.excludeFields = ['field', 'page', 'limit', 'sort'];
