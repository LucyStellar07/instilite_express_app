//EVENT ROUTEs
const express = require('express');
const eventController = require('../../controllers/event.controller');
const router = express.Router();

//all routes prefixed by v1
router
  .route('/addEvent')    //route to add a new event
  .post(eventController.addEvent);

router
  .route('/whats-new-events')           //route to get the new events
  .get(eventController.whatsNewEvents);

router
  .route('/view_day_events')
  .get(eventController.viewDayEvents);
  
router
  .route('/view_month_events')
  .get(eventController.viewMonthEvents);

module.exports = router;