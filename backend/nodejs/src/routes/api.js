const express = require('express');
const router = express.Router();

// Import resource-specific route files
const departmentRoutes = require('./department');
const positionRoutes = require('./position');
const employeeRoutes = require('./employee');
const authRoutes = require('./auth');
const { auth: authMiddleware } = require('../middleware');
// ... other resource routes

// Mount the resource-specific routes
router.use('/department', departmentRoutes);
router.use('/position', positionRoutes);
router.use('/employee', employeeRoutes);
router.use('/auth', authRoutes);
// ... other resource routes

module.exports = router;