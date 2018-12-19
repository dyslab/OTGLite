var express = require('express')
var router = express.Router()
var otgbase = require('./otg-base')

/* GET home page. */
router.get('/', function (req, res, next) {
  // read cookies
  // console.log(otgbase.readCookie(req))
  res.render('index', { nextlink: otgbase.readCookie(req) })
})

module.exports = router
