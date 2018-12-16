var express = require('express')
var router = express.Router()
var htmlparser = require('htmlparser2')
var otgbase = require('./otg-base')

// Use htmlparser2 to parse HTML code of "htmlcode" which get from website ID:240.
function parseHtmlat240 (link, htmlcode, saveto) {
  // errcode = -2 means some error happened on this processing.
  var resObj = { errcode: -2 }

  var domHandler = new htmlparser.DomHandler(function (err, dom) {
    if (!err) {
      //  Next chapters link's css path (refer to the same link):
      //    html > body > div#wrapper > div.content_read > div.box_con > div.bookname > div.bottem1 > a
      //      or
      //    html > body > div#wrapper > div.content_read > div.box_con > div.bottem2 > a
      //  Title's css path:
      //    html > body > div#wrapper > div.content_read > div.box_con > div.bookname > h1
      //  Content's css path:
      //    html > body > div#wrapper > div.content_read > div.box_con > div#content
      //  Check them out via Firefox Browser.
      var tmpChild = otgbase.getChildObjectByTag(dom, 'html')
      tmpChild = otgbase.getChildObjectByTag(tmpChild, 'body')
      tmpChild = otgbase.getChildObjectByID(tmpChild, 'div', 'wrapper')
      tmpChild = otgbase.getChildObjectByClass(tmpChild, 'div', 'content_read')
      var boxcon = otgbase.getChildObjectByClass(tmpChild, 'div', 'box_con')
      // get Title according to the title's css/path.
      tmpChild = otgbase.getChildObjectByClass(boxcon, 'div', 'bookname')
      tmpChild = otgbase.getChildObjectByTag(tmpChild, 'h1')
      var txtContent = otgbase.getContentText(tmpChild)
      // get Content according to the content's css/path.
      tmpChild = otgbase.getChildObjectByID(boxcon, 'div', 'content')
      txtContent += '\r\n\r\n' + otgbase.getContentText(tmpChild)
      // Get Next chapters link
      tmpChild = otgbase.getChildObjectByClass(boxcon, 'div', 'bottem2')
      var strNextLink = otgbase.getNextByTagA(link, tmpChild)

      var fname
      if (saveto === 'txt') {
        // save to TXT file.
        fname = otgbase.savetoTXTfile(otgbase.getTXTFilename(link), txtContent)
      } else {
        // save to DB.
        // fname = otgbase.getBookID(link) + '/' + otgbase.getFileID(link)
        fname = otgbase.savetoDB(otgbase.getBookID(link), otgbase.getFileID(link), txtContent)
      }

      // Return txt filename, next link, errcode = 0 means successful processing.
      // console.log('parseHtml_240() Return Value: ' + otgbase.getTXTFilename(link) + ',' + strNextLink);
      resObj = { filename: fname, nextlink: strNextLink, errcode: 0 }
    }
  })
  var parser = new htmlparser.Parser(domHandler, { decodeEntites: true })
  parser.parseComplete(htmlcode)
  return resObj
}

//  call different function to manipulate data according to the 'website_id'.
function parseHtml (link, body, saveto, websiteid) {
  switch (websiteid) {
    case '240':
      return parseHtmlat240(link, body, saveto)
    default:
      return { errcode: -99 }
  }
}

/* GET */
router.get('/:save_to/:website_id', function (req, res, next) {
  var websiteok = false
  var saveok = false

  // Judge website whether can be parser.
  switch (req.params.website_id) {
    case '240':
      websiteok = true
      break
    default:
      break
  }

  // Judge save data method.
  switch (req.params.save_to) {
    case 'txt':
    case 'db':
      saveok = true
      break
    default:
      break
  }
  console.log(req.params.save_to + ',' + req.params.website_id)

  if (websiteok && saveok) {
    otgbase.GetHtmlCode(req.query.link, function (body) {
      // Return txt filename, next link and errcode.
      res.json(JSON.stringify(parseHtml(req.query.link, body, req.params.save_to, req.params.website_id)))
    }, function (err) {
      console.log(err)
      // Return errcode = -1 means failed processing.
      res.json(JSON.stringify({ errcode: -1 }))
    })
  } else {
    res.json(JSON.stringify({ errcode: -99 }))
  }
})

module.exports = router
