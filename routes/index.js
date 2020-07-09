var express = require('express');
var router = express.Router();

var user_contoller = require('../controllers/userController');

/* GET home page. */
router.get('/', user_contoller.index);

router.get('/sign-up', user_contoller.sign_up_get);

router.post('/sign-up', user_contoller.sign_up_post);

module.exports = router;
