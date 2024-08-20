//const httpStatus = require('http-status');
const { Club } = require('../models');
//const ApiError = require('../utils/ApiError');

const getClubProfile = async (clubname) => {
    return Club.findAll({ where: {club_name:clubname}, });
  };

module.exports = {
    getClubProfile,
  };
  