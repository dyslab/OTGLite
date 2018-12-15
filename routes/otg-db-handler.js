var express = require('express')
var router = express.Router()

/* GET database management page. */
router.get('/', function (req, res, next) {
  // Step 1. Check out the db file is existed or not?

  // Step 2. If yes, count the records then send response.
  //         If no, show up the button "One Click to create DB file and tables".
  const db = require('better-sqlite3')('./public/sqlitedb/otglite.db')
  const stmt = db.prepare('SELECT bookid,pageid,text,updatetime FROM otgdata')
  const rec = stmt.all()
  console.log(rec)

  res.render('dbmanage', { dbok: false, dbcount: 0 })
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
