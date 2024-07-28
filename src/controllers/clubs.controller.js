/*
app.get('/readteamprofile/:club_name', (req, res) => {
    const club_name = req.params.club_name;
    console.log(club_name);
    const teamQuery = "SELECT * FROM club WHERE club_name = ?";
    db.query(teamQuery, [club_name], (err, results) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'User profile not found' });
        }
        res.status(200).json(results);
    });
});
*/

// controller.js
const getTeamProfile = async (req, res) => {
  const clubName = req.params.club_name;
  console.log("hello");

  const [rows] = await db.query('SELECT * FROM club WHERE club_name = ?', [clubName]);
  if (rows.length === 0) {
    return res.status(404).json({ error: 'club profile not found' });
  }
  res.send(rows)
};

module.exports = {
  getTeamProfile,
};

/*
const getUser = catchAsync(async (req, res) => {
    const user = await userService.getUserById(req.params.userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    res.send(user);
  });
*/