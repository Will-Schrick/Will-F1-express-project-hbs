const express = require('express');
const router = express.Router();

const isAuthenticated = require('../middlewares/isAuthenticated');
const isAdmin = require('../middlewares/isAdmin');
//i will add constants below - hope it


router.use('/auth', require('./auth'));    //added .auth folder
router.use('/admin', isAdmin, require('./admin'));    //added .admin folder
// Girogio said add more here below



router.get('/profile', (req, res) => {
  const { email } = req.user;

  res.render('profile', { email })
})

router.get('/', isAuthenticated, function (req, res) {
  console.log(req.session)
  res.render('index', { title: 'Express project template' });
});

module.exports = router;
