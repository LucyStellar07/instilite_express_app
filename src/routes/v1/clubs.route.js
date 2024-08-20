const express = require('express');
const validate = require('../../middlewares/validate');
const clubsValidation = require('../../validations/auth.validation');
const clubsController = require('../../controllers/clubs.controller');
//const auth = require('../../middlewares/auth');
const router = express.Router();

router
    .route('/read_club/:club_name')
    .get(validate(clubsValidation.getClubs), clubsController.getTeamProfile);

router
    .route('/')
    .get(clubsController.whatsnew_apps);

router
    .route('/upcoming_events')
    .get(clubsController.upcoming_events);

module.exports = router;
