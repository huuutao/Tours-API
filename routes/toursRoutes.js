const express = require('express');
const tourRouteHandler = require('../controller/tourRouteHandler');

const tourRouter = express.Router();
// tourRouter.param('id', tourRouteHandler.checkId);

tourRouter
  .route('/cheapest-five-tour')
  .get(tourRouteHandler.changeQueryMW, tourRouteHandler.getTours);
tourRouter.route('/average-price').get(tourRouteHandler.getaveragePrice);
tourRouter.route('/startTime/:year').get(tourRouteHandler.getstartTimeByMonth);
tourRouter
  .route('/:id?')
  .get(tourRouteHandler.getTours)
  .patch(tourRouteHandler.changeTour)
  .delete(tourRouteHandler.deleteTour);

tourRouter.route('/').post(tourRouteHandler.createTour);
module.exports = tourRouter;
