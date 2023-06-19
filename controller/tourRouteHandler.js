const Tour = require('../models/tourModel');
const APIQuery = require('../utils/apiQuery');
const { DBerrorDeliver } = require('./globalErrorHandler');
const { excludeFields } = require('../utils/const');

module.exports.getTours = DBerrorDeliver(async (req, res) => {
  if (!req.params.id) {
    const tourDocument = await new APIQuery(Tour, req.query, excludeFields)
      .filter()
      .select()
      .page()
      .sort();
    res.status(200).json({
      status: 'success',
      length: tourDocument.length,
      data: tourDocument,
    });
  } else {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: tour,
    });
  }
});
// gettours查询为空,不是错误--不用错误传递

module.exports.createTour = DBerrorDeliver(async (req, res) => {
  const newTour = await Tour.create(req.body);
  res.status(200).json({
    status: 'success',
    message: newTour,
  });
});
module.exports.changeTour = DBerrorDeliver(async (req, res) => {
  const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  // if (updatedTour) {
  res.status(201).json({
    status: 'success',
    message: 'Updated Success',
    data: updatedTour,
  });
  // } else {
  //   res.status(200).json({ status: 'error', message: `Invail ID` });
  // }
});
module.exports.deleteTour = DBerrorDeliver(async (req, res) => {
  await Tour.findByIdAndRemove(req.params.id);

  res.status(204).json({
    status: 'success',
    message: 'delete tour',
  });
});

module.exports.getaveragePrice = DBerrorDeliver(async (req, res) => {
  const averagePrice = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 3 } },
    },
    {
      $group: {
        _id: '$difficulty',
        avgRatins: { $avg: '$ratingsAverage' },
        totalPrice: { $sum: '$price' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: {
        avgPrice: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    dataLength: averagePrice.length,
    data: averagePrice,
  });
});

module.exports.getstartTimeByMonth = DBerrorDeliver(async (req, res) => {
  const states = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $lte: new Date(`${req.params.year}-12-31`),
          $gte: new Date(`${req.params.year}-1-1`),
        },
      },
    },
    {
      $group: {
        _id: {
          $month: '$startDates',
        },
        count: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { month: 1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    dataLength: states.length,
    data: states,
  });
});

module.exports.changeQueryMW = async (req, res, next) => {
  req.query.sort = 'price';
  req.query.limit = 5;
  req.query.page = 1;
  next();
};
