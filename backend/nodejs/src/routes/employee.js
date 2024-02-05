const express = require('express');
const fileUpload = require('express-fileupload')
const { employee } = require('../controllers');
const router = express.Router();

// Define routes and map to controller methods
router.get('/', employee.getAll);
router.get('/:id', employee.getById);
router.post('/', fileUpload(), employee.create);
router.put('/:id', fileUpload(), employee.update);
// router.delete('/:id', employee.delete);

module.exports = router;