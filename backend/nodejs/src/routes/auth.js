const express = require('express');
const { auth } = require('../controllers');
const router = express.Router();

// Define routes and map to controller methods
router.post('/login', auth.login);

module.exports = router;