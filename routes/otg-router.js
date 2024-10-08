var express = require('express')
var router = express.Router()
var htmlparser = require('htmlparser2')
var otgbase = require('./otg-base')

// ------------------------------------------------------------------------------------------------
// Html page parsing process (ID: qingyunian)
// Compatible Sites: 
//  http://www.qingyunian.net/54.html
function parseHtmlatQYN (link, htmlcode, saveto) {
  // errcode = -2 means some error happened on this processing.
  var resObj = { errcode: -2 }

  var domHandler = new htmlparser.DomHandler(function (err, dom) {
    if (!err) {
      var tmpChild = otgbase.getChildObjectByTag(dom, 'html')
      tmpChild = otgbase.getChildObjectByTag(tmpChild, 'body')
      var boxcon = otgbase.getChildObjectByClass(tmpChild, 'div', 'main')
      // get Title according to the title's css/path.
      tmpChild = otgbase.getChildObjectByTag(boxcon, 'h1')
      var txtContent = otgbase.getContentText(tmpChild)
      // get Content according to the content's css/path.
      tmpChild = otgbase.getChildObjectByClass(boxcon, 'div', 'content')
      txtContent += otgbase.getContentTextFromChildTag(tmpChild, 'p')
      // remove verbose text from '下一章' or '上一章' and tags like '\n','\t'...
      var removepos = txtContent.search(/下一章/)
      if (removepos < 0) {
        removepos = txtContent.search(/上一章/)
        if (removepos > 0) {
          txtContent = txtContent.substr(0, removepos)
        }
      } else {
        txtContent = txtContent.substr(0, removepos)
      }
      txtContent = txtContent.replace(/\t/g, '')
      txtContent = txtContent.replace(/\n\n/g, '\n')
      // console.log(txtContent.length)
      var fname = otgbase.autoSave(link, txtContent, saveto)

      var ecode = 0
      try {
        // Get Next chapters link
        tmpChild = otgbase.getChildObjectByChildTagText(tmpChild, 'p', '下一章')
        var strNextLink = otgbase.getNextByTagA(link, tmpChild)
        strNextLink = otgbase.removeBaseURL(strNextLink)
      } catch (err) {
        ecode = -1
      }
      // Return txt/db filename, next link, errcode = 0 means successful processing.
      resObj = { filename: fname, nextlink: strNextLink, errcode: ecode }
    }
  })
  var parser = new htmlparser.Parser(domHandler, { decodeEntites: true })
  parser.parseComplete(htmlcode)
  return resObj
}

// ------------------------------------------------------------------------------------------------
// Html page parsing process (ID: biqugex)
// Compatible Sites: 
//  https://m.biqugex.com/book_10611/5709649.html
//  https://m.xbiqugex.cc/book_10611/618843174.html
//  https://m.ddyueshu.cc/wapbook/35829602_709677954.html
function parseHtmlatBQGX (link, htmlcode, saveto) {
  // errcode = -2 means some error happened on this processing.
  var resObj = { errcode: -2 }

  var domHandler = new htmlparser.DomHandler(function (err, dom) {
    if (!err) {
      var tmpChild = otgbase.getChildObjectByTag(dom, 'html')
      var boxcon = otgbase.getChildObjectByTag(tmpChild, 'body')
      tmpChild = otgbase.getChildObjectByID(boxcon, 'div', 'chaptercontent')
      var txtContent = otgbase.getContentText(tmpChild) + '\n'

      var fname = otgbase.autoSave(link, txtContent, saveto)

      var ecode = 0
      try {
        // Get Next chapters link
        tmpChild = otgbase.getChildObjectByClassIndex(boxcon, 'p', 'Readpage', 2)
        var strNextLink = otgbase.getNextByTagAID(link, tmpChild, 'pb_next')
      } catch (err) {
        ecode = -1
      }
      // Return txt/db filename, next link, errcode = 0 means successful processing.
      resObj = { filename: fname, nextlink: strNextLink, errcode: ecode }
    }
  })
  var parser = new htmlparser.Parser(domHandler, { decodeEntites: true })
  parser.parseComplete(htmlcode)
  return resObj
}

// ------------------------------------------------------------------------------------------------
// Html page parsing process (ID: ghost580)
// Compatible Sites: 
//  https://www.ghost580.com/read/64258/17990253.html
function parseHtmlatGhost580 (link, htmlcode, saveto) {
  // errcode = -2 means some error happened on this processing.
  var resObj = { errcode: -2 }

  var domHandler = new htmlparser.DomHandler(function (err, dom) {
    if (!err) {
      let tmpChild = otgbase.getChildObjectByTag(dom, 'html')
      // tmpChild = otgbase.getChildObjectByTag(tmpChild, 'body')
      const container = otgbase.getChildObjectByClass(tmpChild, 'div', 'container')
      tmpChild = otgbase.getChildObjectByClass(container, 'div', 'content')
      const acontent = otgbase.getChildObjectByID(tmpChild, 'div', 'acontent')
      // get Title according to the content's css/path.
      tmpChild = otgbase.getChildObjectByTag(acontent, 'h1')
      const title =otgbase.getContentText(tmpChild)
      // get Content according to the content's css/path.
      tmpChild = otgbase.getChildObjectByID(acontent, 'div', 'rtext')
      const text = otgbase.getContentText(tmpChild)
      let txtContent = `\n\n${title}\n\n${text}\n`

      var fname = otgbase.autoSave(link, txtContent, saveto)

      var ecode = 0
      try {
        // Get Next chapters link
        tmpChild = otgbase.getChildObjectByClass(acontent, 'p', 'text-center')
        var strNextLink = otgbase.getNextByTagAID(link, tmpChild, 'linkNext')
      } catch (err) {
        ecode = -1
      }
      // Return txt/db filename, next link, errcode = 0 means successful processing.
      resObj = { filename: fname, nextlink: strNextLink, errcode: ecode }
    }
  })
  var parser = new htmlparser.Parser(domHandler, { decodeEntites: true })
  parser.parseComplete(htmlcode)
  return resObj
}

// ================================================================================================
//  Invoke function to manipulate data based on 'website_id'.
function parseHtml (link, body, saveto, websiteid) {
  switch (websiteid) {
    case 'qingyunian':
      return parseHtmlatQYN(link, body, saveto)
    case 'biqugex':
      return parseHtmlatBQGX(link, body, saveto)
    case 'ghost580':
      return parseHtmlatGhost580(link, body, saveto)
    default:
      return { errcode: -99 }
  }
}

/* GET */
router.get('/:save_to/:website_id', function (req, res, next) {
  console.log(`Text content save to: ${req.params.save_to}, Website ID: ${req.params.website_id}`)

  if (['qingyunian', 'biqugex', 'ghost580'].includes(req.params.website_id) 
    && ['txt', 'db'].includes(req.params.save_to)) {
    otgbase.GetHtmlCode(req.query.link, function (body) {
      // Return txt filename, next link and errcode.
      var retinfo = parseHtml(req.query.link, body, req.params.save_to, req.params.website_id)

      if (retinfo.nextlink && retinfo.nextlink !== undefined) {
        let next_link = retinfo.nextlink
        if (retinfo.nextlink.match(/^http[s]?:\/\//) === null) {
          next_link = otgbase.getBaseLink(req.query.link) + next_link
        } 
        otgbase.writeCookie(res, next_link) // write cookie
      }
      otgbase.savetoLog(retinfo) // save log
      res.json(JSON.stringify(retinfo))
    }, function (err) {
      console.log(err)
      // Return errcode = -1 means failed processing.
      var err1 = { errcode: -1, errmessage: 'html page parse failed. maybe at the end as well.' }

      otgbase.savetoLog(err1) // save log
      res.json(JSON.stringify(err1))
    })
  } else {
    var err2 = { errcode: -99, errmessage: 'parameter invalid.' }

    otgbase.savetoLog(err2) // save log
    res.json(JSON.stringify(err2))
  }
})

module.exports = router
