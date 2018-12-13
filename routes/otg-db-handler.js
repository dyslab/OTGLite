var express = require('express');
var router = express.Router();

/* GET database management page. */
router.get('/', function(req, res, next) {
  res.render('dbmanage', { dbcount: 0 });
});

/* GET database export action. */
router.get('/export', function(req, res, next) {
});

/* GET database remove action. */
router.get('/remove', function(req, res, next) {
});

module.exports = router;