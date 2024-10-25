const bodyParser = require('body-parser');
const mysql = require('mysql2');
const { v4: uuidv4 } = require('uuid');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const config = require('../config/config');
const catchAsync = require('../utils/catchAsync');
const { Sequelize } = require('sequelize');
const Event = require('../models/event.model')
const sequelize = new Sequelize(config.mysql.database, config.mysql.username, config.mysql.password, {
    host: config.mysql.host,
    dialect: 'mysql',
    logging: false,
  });


  //function for adding an event to the table
const addEvent = catchAsync(async (req, res) => {
    try {
        const {
            event_name,
            event_type,
            event_details,
            start_time,
            end_time,
            venue,
            created_by
        } = req.body;

        // Automatically set these fields
        const created_at = new Date();
        const updated_at = new Date();
        const pstart_time=new Date(req.body.start_time)
        const pend_time=new Date(req.body.end_time)

        // pstart_time.setHours(pstart_time.getHours() - 5);
        // pstart_time.setMinutes(pstart_time.getMinutes() - 30);

        // pend_time.setHours(pend_time.getHours() - 5);
        // pend_time.setMinutes(pend_time.getMinutes() - 30);

        // Event data structure
        const eventData = {
            event_id: uuidv4(), // Generate a unique ID for the event
            event_name,
            event_type,
            event_details,
            start_time:pstart_time,
            end_time:pend_time,
            venue,
            created_by,
            created_at,
            updated_at
        };



        // Insert data using Sequelize
        const newEvent = await Event.create(eventData);
        res.send('Event added successfully');
    } catch (err) {
        console.error('Error inserting data into database:', err);
        res.status(500).send('Server error');
    }
});


//function to get the events added to the table in the last 24 hours to show whats new
const whatsNewEvents = catchAsync(async (req, res) => {
    try {
      const query = "SELECT * FROM events WHERE created_at >= NOW() - INTERVAL 24 HOUR";
      const results = await sequelize.query(query, { type: Sequelize.QueryTypes.SELECT, raw:true });
      
      // Log the query results (optional)
      console.log("Query results:", results);
  
      // Include metadata in the response
      res.status(200).json({
        success: true,
        count: results.length,
        data: results
      });
    } catch (err) {
      console.error("Error executing SQL query:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });


//month:
const viewDayEvents = catchAsync(async (req, res) => {
    const chosenDate = req.query.chosen_date; // Should be in 'YYYY-MM-DD' format

    // Check if chosen_date is provided
    if (!chosenDate) {
        return res.status(400).json({ error: 'Chosen date parameter is required' });
    }

    // Construct start_time and end_time based on chosen_date
    const startTime = `${chosenDate} 00:00:00`;
    const endTime = `${chosenDate} 23:59:59`;

    // mapping event_type to numeric code
    const eventTypeCodes = {
        'GSB': 1,
        'personal': 2
    };

    // Construct the basic query without event_type condition
    let query = `
        SELECT event_id, event_name, event_details, start_time, end_time, venue, event_type, created_by, created_at
        FROM events 
        WHERE start_time >= ? AND end_time <= ?
    `;
    const queryParams = [startTime, endTime];


    try {
        const results = await sequelize.query(query, {
            replacements: queryParams,
            type: Sequelize.QueryTypes.SELECT,
            raw : true
        });

        // Handle case where no events are found
        if (results.length === 0) {
            return res.json({
                message: 'No events found',
                dayEvents: []
            });
        }

        // Map results to the desired format
        const dayEvents = results.map(event => ({  //send all event database details
            event_id: event.event_id,
            event_name: event.event_name,
            event_details: event.event_details,
            start_time: event.start_time,  //check parsing
            end_time: event.end_time,
            venue: event.venue,
            created_by: event.created_by,  // Added
            created_at: event.created_at,  // Added
            updated_at: event.updated_at,   // Added
            event_type: event.event_type
   
        }));

        // Send the response with the events
        res.json({ dayEvents });
    } catch (error) {
        console.error('Failed to retrieve events:', error);
        res.status(500).json({ error: 'Failed to retrieve events' });
    }
});

const viewMonthEvents = catchAsync(async (req, res) => {
    // Define eventTypeCodes mapping
    const eventTypeCodes = {
        'GSB': 1,
        'personal': 2
    };

    const currentYear = new Date().getFullYear(); // Get current year
    const month = parseInt(req.query.month, 10); // Month of the year (1-12)

    // Validate month parameter
    if (!month || isNaN(month) || month < 1 || month > 12) {
        return res.status(400).json({ error: 'Month parameter is required and must be valid' });
    }

    // Function to get the number of days in a month
    const daysInMonth = new Date(currentYear, month, 0).getDate();

    // Construct start_date and end_date based on the month and current year
    const startDate = `${currentYear}-${month.toString().padStart(2, '0')}-01`;
    const endDate = `${currentYear}-${month.toString().padStart(2, '0')}-${daysInMonth}`;

    // Construct the base query to retrieve event details for each event in the month
    let query = `
        SELECT start_time, event_type
        FROM events
        WHERE start_time >= ? AND start_time <= ?
    `;
    const queryParams = [startDate, endDate];

    try {
        const results = await sequelize.query(query, {
            replacements: queryParams,
            type: Sequelize.QueryTypes.SELECT
        });

        // Handle case where no events are found
        if (results.length === 0) {
            return res.json({
                message: 'No events found for the specified month',
                monthEvents: []
            });
        }

        const monthEvents = results.map(event => ({
            startTime: event.start_time, //formatDateTime(event.start_time), // Format to 'yyyy-MM-dd HH:mm:ss'
            eventTypecode: eventTypeCodes[event.event_type] || 0 // Map event_type to code, default to 0 if not found
        }));

        // Send the response with the month events
        res.json({ monthEvents });
    } catch (error) {
        console.error('Failed to retrieve month events:', error);
        res.status(500).json({ error: 'Failed to retrieve month events' });
    }
});



module.exports = {
    addEvent,
    whatsNewEvents,
    viewDayEvents,
    viewMonthEvents
};




