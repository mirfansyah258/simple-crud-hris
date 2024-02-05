const express = require('express');
const router = express.Router();

// Import resource-specific route files
const departmentRoutes = require('./department');
const positionRoutes = require('./position');
// ... other resource routes

// Mount the resource-specific routes
router.use('/department', departmentRoutes);
router.use('/position', positionRoutes);
// ... other resource routes

module.exports = router;