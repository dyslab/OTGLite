var express = require('express')
var router = express.Router()
var otgbase = require('./otg-base')

/* GET log information first page. */
router.get('/', function (req, res, next) {
  console.log(otgbase.getLogfilenames())
  res.render('loginfo', { logfilenames: otgbase.getLogfilenames() })
})

/* GET view log file. */
router.get('/view', function (req, res, next) {
  res.send(otgbase.readLogFile(req.query.logfile))
})

module.exports = router
