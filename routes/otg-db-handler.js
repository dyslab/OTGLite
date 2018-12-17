var express = require('express')
var router = express.Router()
var otgbase = require('./otg-base')

/* GET database management page. */
router.get('/', function (req, res, next) {
  // Check out the db file is existed or not?
  //   If yes, count the records then send response.
  //   If no, automatically create DB file and tables then return 0.
  res.render('dbmanage', otgbase.checkoutDatabase())
  // Below for test
  // res.render('dbmanage', { recordcount: 0, bookdata: undefined })
})

/* GET database export action. */
router.get('/export/:bookid', function (req, res, next) {
  // Export db records to a single TXT file by bookid.
  res.attachment(req.params['bookid'] + '.txt')
  res.send(otgbase.exportTXTfileFromDB(req.params['bookid']))
})

/* GET database remove action. */
router.get('/remove/:bookid', function (req, res, next) {
  // Remove db records by bookid.
  otgbase.removeRecordFromDB(req.params['bookid'])
  res.redirect('/db')
})

module.exports = router
