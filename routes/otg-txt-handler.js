var express = require('express');
var router = express.Router();
var otgbase = require('./otg-base');

/* GET txt management page. */
router.get('/', function(req, res, next) {
  res.render('txtmanage', { filecount: otgbase.getFileCount() });
});

/* GET txt export action. */
router.get('/export', function(req, res, next) {
  res.attachment('otg-export-' + Date.now() + '.txt');
  res.send(otgbase.exportTXTfile());
});

/* GET txt remove action. */
router.get('/remove', function(req, res, next) {
  otgbase.removeAllFiles();
  res.redirect('/txt');
});

module.exports = router;