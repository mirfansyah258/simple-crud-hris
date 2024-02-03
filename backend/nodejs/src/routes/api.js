const express = require('express');
const router = express.Router();

// Import resource-specific route files
const departmentRoutes = require('./department');
// ... other resource routes

// Mount the resource-specific routes
router.use('/department', departmentRoutes);
// ... other resource routes

module.exports = router;