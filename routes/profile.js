const express = require('express');
const router = express.Router();
const prisma = require('../prisma');
const isAuthenticated = require('../middlewares/isAuthenticated'); // Middleware to ensure authentication

// Route to display user profile after login
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }, // Fetch the logged-in user's details
      include: { team: true }, // Include related team details
    });

    if (!user) {
      req.flash('error', 'User not found.');
      return res.redirect('/auth/login-page');
    }
    const isAdmin = user.teamRole === "TEAMMANAGER";
    res.render('profile', {
      user: {
        ...user,
        isAdmin, // Pass user data to the profile.hbs template
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).send('An error occurred while loading the profile.');
  }
});

module.exports = router;