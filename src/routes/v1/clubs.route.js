const express = require('express');
const clubsController = require('../../controllers/clubs.controller');
const router = express.Router();

router
    .route('/read_club/:club_name')
    .get(clubsController.getTeamProfile);

router
    .route('/')
    .get(clubsController.whatsnew_apps);

router
    .route('/upcoming_events')
    .get(clubsController.upcoming_events);

module.exports = router;