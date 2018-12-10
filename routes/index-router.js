var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* GET txt management page. */
router.get('/txtmanage', function(req, res, next) {
  res.render('txtmanage');
});

/* GET txt management page. */
router.get('/dbmanage', function(req, res, next) {
  res.render('dbmanage');
});

module.exports = router;