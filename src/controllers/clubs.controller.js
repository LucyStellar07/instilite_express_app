const Club = require('../models/clubs.model'); // Adjust the path to your model
const Event = require('../models/event.model'); // Adjust the path to your model
const config = require('../config/config');
const clubService = require('../services/clubs.service'); // Adjust the path to your model
const catchAsync = require('../utils/catchAsync')

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(config.mysql.database, config.mysql.username, config.mysql.password, {
    host: config.mysql.host,
    dialect: 'mysql',
    logging: false,
  });

//modified club profile controller
const getTeamProfile = catchAsync(async (req, res) => {
  const club = await clubService.getClubProfile(req.params.club_name);
  if (!club) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Club not found');
  }
  res.send(club);
});


// //view club profile details!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// const getTeamProfile = async (req, res) => {
//   const clubName = req.params.club_name;
//   console.log("hello");
//   console.log("first get");

//   try {
//     const club = await Club.findAll({ where: { club_name: clubName } });
//     console.log(club);
//     if (!club) {
//       return res.status(404).json({ error: 'Club profile not found' });
//     }
//     res.json(club);
//   } catch (error) {
//     console.error('Error fetching club profile:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

//what's new apps!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const whatsnew_apps = async (req, res) => {
  console.log("hello");
  console.log("HI");

  try {
    const results = await sequelize.query(
      "SELECT club_name, club_apps FROM club WHERE updated_at >= NOW() - INTERVAL 24 HOUR",
      {
        type: sequelize.QueryTypes.SELECT
      }
    );

    res.json(results);
  } catch (error) {
    console.error('Error fetching whats new for clubs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//club wise upcoming events!!!!!!!!!!!!!!!!!!!!
const upcoming_events = async (req, res) => {
  const club = req.query.club;
  if (!club) {
      return res.status(400).json({ error: 'Club parameter is required' });
  }

  try {
      const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const results = await sequelize.query(
          `SELECT event_id, event_name, event_details, start_time, end_time, venue, created_by
           FROM events
           WHERE created_by = :club AND start_time > :currentTime AND event_type = 'GSB'`,
          {
              replacements: { club, currentTime },
              type: sequelize.QueryTypes.SELECT
          }
      );

      res.json(results);
  } catch (error) {
      console.error('Error fetching upcoming events:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = { getTeamProfile, whatsnew_apps, upcoming_events };
