const express = require('express');
const router = express.Router();
const prisma = require('../prisma');
const isAdmin = require('../middlewares/isAdmin.js'); // added to link it
const { name } = require('../app.js');

// original code here- 3 lines
/*
router.get('/', isAdmin,async (req, res) => {
  res.render('admin');
});
*/

router.get('/', isAdmin, async (req, res) => {
  try {
    // Count users who do not have a team assigned
    const unassignedCount = await prisma.user.count({
      where: { teamId: null },
    });

    // Fetch users who do not have a team assigned
    const unassignedUsers = await prisma.user.findMany({
      where: { teamId: null },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    // Fetch all teams to display in the dropdown
    const teams = await prisma.team.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    // Fetch all users from the same team as the logged-in admin
    console.log('Logged-in user teamId:', req.user?.teamId);
    const teamUsers = await prisma.user.findMany({
      where: { teamId: req.user.teamId },
      select: {
        id: true,
        name: true,
        email: true,
        teamRole: true,
        dob: true,
        team: {
          select: {
            name: true,
          },
        },
      },
    });
    //added date modification for .hbs
    const formattedUsers = teamUsers.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      teamRole: user.teamRole,
      dob: user.dob ? new Date(user.dob).toLocaleDateString('en-GB') : 'N/A',
      teamName: user.team ? user.team.name : 'No Team',  // Ensure team name is added correctly
    }));
    
    console.log('Formatted team users:', formattedUsers); 

    res.render('admin', {
      unassignedCount,
      unassignedUsers,
      teamUsers: formattedUsers,
      teams,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading admin page');
  }
});

router.post('/assign-team', async (req, res) => {
  const { email, teamId } = req.body;
  console.log('Assigning email:', email, 'to team ID:', teamId);
  try {
    await prisma.user.update({
      where: { email: email },
      data: {
        teamId: parseInt(teamId, 10),
      },
    });

    req.flash('success_msg', `Team assigned successfully to ${email}`);
    res.redirect('/admin'); // Redirect to admin dashboard
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'An error occurred while assigning the team.');
    res.redirect('/admin');
  }
});


module.exports = router;
