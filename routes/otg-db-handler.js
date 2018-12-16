var express = require('express')
var router = express.Router()
var otgbase = require('./otg-base')

/* GET database management page. */
router.get('/', function (req, res, next) {
  // Check out the db file is existed or not?
  //   If yes, count the records then send response.
  //   If no, automatically create DB file and tables then return 0.
  res.render('dbmanage', { dbcount: otgbase.checkoutDatabase() })
})

/* GET database create action. */
router.get('/create', function (req, res, next) {
  // Create db file and table then send reponse.
})

/* GET database export action. */
router.get('/export/:bookid', function (req, res, next) {
  // Export db records to a single TXT file by bookid.
})

/* GET database remove action. */
router.get('/remove/:bookid', function (req, res, next) {
  // Remove db records by bookid.
})

module.exports = router
