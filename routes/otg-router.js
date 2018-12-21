var express = require('express')
var router = express.Router()
var htmlparser = require('htmlparser2')
var otgbase = require('./otg-base')

// ------------------------------------------------------------------------------------------------
// Main html parse process
// For website id: 240
// example link: http://www.xiaoshuo240.cn/book/1003/860406.html
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
      txtContent += '\n\n' + otgbase.getContentText(tmpChild)

      var fname = otgbase.autoSave(link, txtContent, saveto)

      var ecode = 0
      try {
        // Get Next chapters link
        tmpChild = otgbase.getChildObjectByClass(boxcon, 'div', 'bottem2')
        var strNextLink = otgbase.getNextByTagA(link, tmpChild)
      } catch (err) {
        ecode = -1
      }
      // Return txt/db filename, next link, errcode = 0 means successful processing.
      // console.log('Return Value: ' + otgbase.getTXTFilename(link) + ',' + strNextLink);
      resObj = { filename: fname, nextlink: strNextLink, errcode: ecode }
    }
  })
  var parser = new htmlparser.Parser(domHandler, { decodeEntites: true })
  parser.parseComplete(htmlcode)
  return resObj
}

// ------------------------------------------------------------------------------------------------
// Main html parse process
// For website id: qingyunian
// example link: http://www.qingyunian.net/54.html
function parseHtmlatQYN (link, htmlcode, saveto) {
  // errcode = -2 means some error happened on this processing.
  var resObj = { errcode: -2 }

  var domHandler = new htmlparser.DomHandler(function (err, dom) {
    if (!err) {
      //  Next chapters link's css path (refer to the same link):
      //    html body div.main div.content p a
      //  Title's css path:
      //    html body div.main h1
      //  Content's css path:
      //    html body div.main div.content p
      //  Check them out via Firefox Browser.
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
// Main html parse process
// For website id: biqugex
// example link: https://m.biqugex.com/book_10611/5709649.html
function parseHtmlatBQGX (link, htmlcode, saveto) {
  // errcode = -2 means some error happened on this processing.
  var resObj = { errcode: -2 }

  var domHandler = new htmlparser.DomHandler(function (err, dom) {
    if (!err) {
      //  Next chapters link's css path (refer to the same link):
      //    html body#read.read p.Readpage a#pb_next.Readpage_down.js_page_down
      //  Title's css path:
      //    html body#read.read div.header span.title
      //  Content's css path:
      //    html body#read.read div#chaptercontent.Readarea.ReadAjax_content
      //  Check them out via Firefox Browser.
      var tmpChild = otgbase.getChildObjectByTag(dom, 'html')
      var boxcon = otgbase.getChildObjectByTag(tmpChild, 'body')
      // get Title according to the title's css/path.
      /*
        tmpChild = otgbase.getChildObjectByClass(boxcon, 'div', 'header')
        tmpChild = otgbase.getChildObjectByClass(tmpChild, 'span', 'title')
        var txtContent = otgbase.getContentText(tmpChild)
      */
      // get Content according to the content's css/path.
      console.log(boxcon.length)
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
// Main html parse process
// For website id: booktxt
// example link: https://m.booktxt.net/wapbook/1722_564289.html
function parseHtmlatBTXT (link, htmlcode, saveto) {
  // errcode = -2 means some error happened on this processing.
  var resObj = { errcode: -2 }

  var domHandler = new htmlparser.DomHandler(function (err, dom) {
    if (!err) {
      //  Next chapters link's css path (refer to the same link):
      //    html body#read.read p.Readpage a#pt_next.Readpage_down
      //  Title's css path:
      //    html body#read.read header#top.channelHeader.channelHeader2 span.title
      //  Content's css path:
      //    html body#read.read div#chaptercontent.Readarea.ReadAjax_content
      //  Check them out via Firefox Browser.
      var tmpChild = otgbase.getChildObjectByTag(dom, 'html')
      var boxcon = otgbase.getChildObjectByTag(tmpChild, 'body')
      // get Title according to the title's css/path.
      tmpChild = otgbase.getChildObjectByID(boxcon, 'header', 'top')
      tmpChild = otgbase.getChildObjectByClass(tmpChild, 'span', 'title')
      var txtContent = otgbase.getContentText(tmpChild)
      // get Content according to the content's css/path.
      tmpChild = otgbase.getChildObjectByID(boxcon, 'div', 'chaptercontent')
      txtContent += otgbase.getContentText(tmpChild) + '\n'

      var fname = otgbase.autoSave2(link, txtContent, saveto)

      var ecode = 0
      try {
        // Get Next chapters link
        tmpChild = otgbase.getChildObjectByClassIndex(boxcon, 'p', 'Readpage', 2)
        var strNextLink = otgbase.getNextByTagAID(link, tmpChild, 'pt_next')
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
// Main html parse process
// For website id: wangshu
// example link: http://m.wangshu.la/book-8850/2017665.html
function parseHtmlatWSL (link, htmlcode, saveto) {
  // errcode = -2 means some error happened on this processing.
  var resObj = { errcode: -2 }

  var domHandler = new htmlparser.DomHandler(function (err, dom) {
    if (!err) {
      //  Next chapters link's css path (refer to the same link):
      //    html body#nr_body.nr_all.c_nr div div.nr_page table (!tbody) tr td.next a#pt_next
      //    or
      //    html body#nr_body.nr_all.c_nr div div.nr_page table (!tbody) tr td.next a#pb_next
      //  Title's css path:
      //    html body#nr_body.nr_all.c_nr div#_bqgmb_head.header h1#_bqgmb_h1
      //  Content's css path:
      //    html body#nr_body.nr_all.c_nr div div#nr.nr_nr div#nr1
      //  Check them out via Firefox Browser.
      var tmpChild = otgbase.getChildObjectByTag(dom, 'html')
      var boxcon = otgbase.getChildObjectByTag(tmpChild, 'body')
      // get Title according to the title's css/path.
      tmpChild = otgbase.getChildObjectByID(boxcon, 'div', '_bqgmb_head')
      tmpChild = otgbase.getChildObjectByID(tmpChild, 'h1', '_bqgmb_h1')
      var txtContent = otgbase.getContentText(tmpChild)
      // get Content according to the content's css/path.
      boxcon = otgbase.getChildObjectByTagIndex(boxcon, 'div', 2)
      tmpChild = otgbase.getChildObjectByID(boxcon, 'div', 'nr')
      tmpChild = otgbase.getChildObjectByID(tmpChild, 'div', 'nr1')
      txtContent += '\n\n' + otgbase.getContentText(tmpChild) + '\n'

      var fname = otgbase.autoSave(link, txtContent, saveto)

      var ecode = 0
      try {
        // Get Next chapters link
        tmpChild = otgbase.getChildObjectByClass(boxcon, 'div', 'nr_page')
        tmpChild = otgbase.getChildObjectByTag(tmpChild, 'table')
        tmpChild = otgbase.getChildObjectByTag(tmpChild, 'tr')
        tmpChild = otgbase.getChildObjectByClass(tmpChild, 'td', 'next')
        var strNextLink = otgbase.getNextByTagAID(link, tmpChild, 'pt_next')
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
// Main html parse process
// For website id: xsb
// example link: https://k.xinshubao.net/1/1668/92947.html
function parseHtmlatXSB (link, htmlcode, saveto) {
  // errcode = -2 means some error happened on this processing.
  var resObj = { errcode: -2 }

  var domHandler = new htmlparser.DomHandler(function (err, dom) {
    if (!err) {
      //  Next chapters link's css path (refer to the same link):
      //    html body#nr_body div.nr_page a
      //  Title's css path:
      //    html body#nr_body div#nr_title.nr_title
      //  Content's css path:
      //    html body#nr_body div#nr1.nr_nr
      //  Check them out via Firefox Browser.
      var tmpChild = otgbase.getChildObjectByTag(dom, 'html')
      var boxcon = otgbase.getChildObjectByTag(tmpChild, 'body')
      // get Title according to the title's css/path.
      tmpChild = otgbase.getChildObjectByID(boxcon, 'div', 'nr_title')
      var txtContent = otgbase.getContentText(tmpChild)
      // get Content according to the content's css/path.
      tmpChild = otgbase.getChildObjectByID(boxcon, 'div', 'nr1')
      txtContent += '\n\n' + otgbase.getContentText(tmpChild) + '\n'

      var fname = otgbase.autoSave(link, txtContent, saveto)

      var ecode = 0
      try {
        // Get Next chapters link
        tmpChild = otgbase.getChildObjectByClassIndex(boxcon, 'div', 'nr_page', 2)
        var strNextLink = otgbase.getNextByTagAIndex(link, tmpChild, 3)
        strNextLink = otgbase.removeBaseURL(strNextLink.replace(/\n/, ''))
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
//  call different function to manipulate data according to the 'website_id'.
function parseHtml (link, body, saveto, websiteid) {
  switch (websiteid) {
    case '240':
      return parseHtmlat240(link, body, saveto)
    case 'qingyunian':
      return parseHtmlatQYN(link, body, saveto)
    case 'biqugex':
      return parseHtmlatBQGX(link, body, saveto)
    case 'booktxt':
      return parseHtmlatBTXT(link, body, saveto)
    case 'wangshu':
      return parseHtmlatWSL(link, body, saveto)
    case 'xsb':
      return parseHtmlatXSB(link, body, saveto)
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
    case 'qingyunian':
    case 'biqugex':
    case 'booktxt':
    case 'wangshu':
    case 'xsb':
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
      var retinfo = parseHtml(req.query.link, body, req.params.save_to, req.params.website_id)

      if (retinfo.nextlink && retinfo.nextlink !== undefined) {
        otgbase.writeCookie(res, req.query.link.split(/\//).slice(0, 3).join('/') + retinfo.nextlink) // write cookie
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
