const router = require('express').Router();
const ctrls = require('../controllers/user');

router.post('/register', ctrls.register);
router.post('/login', ctrls.login);

module.exports = router;

// CRUD | Create - Read - Update - Delete | POST - GET - PUT - DELETEeee
// CREATE (POST) + PUT - body
// GET + DELETE - query // ?fdfdsf&fdfs
