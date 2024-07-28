const express = require('express');
//const auth = require('../../middlewares/auth');
//const validate = require('../../middlewares/validate');
//const clubsValidation = require('../../validations/user.validation');
const clubsController = require('../../controllers/clubs.controller');

const router = express.Router();

router
    .route('/')
  //.get(clubsController.getUsers);

    .get(clubsController.getTeamProfile, catchAsync(async (req, res) => {
        const teamData = await clubsController.getTeamProfile(req);
        res.status(200).json(teamData);
    }));

/*
router
  .route('/:userId')
  .get(auth('getUsers'), validate(userValidation.getUser), userController.getUser)
  .patch(auth('manageUsers'), validate(userValidation.updateUser), userController.updateUser)
  .delete(auth('manageUsers'), validate(userValidation.deleteUser), userController.deleteUser);
*/

module.exports = router;