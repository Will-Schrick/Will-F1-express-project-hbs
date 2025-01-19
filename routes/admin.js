const express = require('express');
const router = express.Router();
const isAdmin = require('../middlewares/isAdmin.js');  // added to link it

router.get('/', async (req, res) => {
  res.render('admin')
});

module.exports = router;
