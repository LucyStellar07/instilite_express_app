const Joi = require('joi');
//const { password } = require('./custom.validation');

const getClubs = {
    query: Joi.object().keys({
        club_name: Joi.string().required(),
        club_desc: Joi.string().required(),
        club_web: Joi.string().required(),
        club_apps: Joi.string().required(),
        updated_at: Joi.date().required(),
    }),
  };

module.exports = {
  getClubs,
};
