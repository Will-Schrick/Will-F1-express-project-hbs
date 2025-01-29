const express = require('express');
const router = express.Router();
const prisma = require('../prisma');
const isAdmin = require('../middlewares/isAdmin.js'); // added to link it
const { name } = require('../app.js');


// Edit user page
router.get('/:id', isAdmin, async (req, res) => {
    try {
        const userId = req.params.id;  // Keep as a string if UUID
        console.log(`Fetching user with ID: ${userId}`);
        const user = await prisma.user.findUnique({ where: { id: userId } });
        const teams = await prisma.team.findMany();

        if (!user) {
            req.flash('error_msg', 'User not found');
            return res.redirect('/admin');
        }

        res.render('edit-user', { user, teams });
    } catch (error) {
        console.error('Error fetching user:', error);
        req.flash('error_msg', 'An error occurred while fetching user details.');
        res.redirect('/admin');
    }
});

// Handle user update
router.post('/update-user/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, teamRole, teamId } = req.body;

    console.log(`Updating user with ID: ${id}`);
    console.log('Received data:', req.body);

    try {
        await prisma.user.update({
            where: { id: id },  
            data: { 
                name, 
                email, 
                teamRole, 
                teamId: teamId ? parseInt(teamId, 10) : null  // Handle null case if teamId is optional
            },
        });

        req.flash('success_msg', 'User updated successfully');
        res.redirect(`/admin/edit-user/${id}`);
    } catch (error) {
        console.error('Error updating user:', error);
        req.flash('error_msg', 'An error occurred while updating the user.');
        res.redirect(`/admin/edit-user/${id}`);
    }
});

// Handle user deletion
router.post('/delete-user/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.user.delete({ where: { id: id } });
        req.flash('success_msg', 'User deleted successfully');
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'An error occurred while deleting the user.');
        res.redirect('/admin');
    }
});

module.exports = router;