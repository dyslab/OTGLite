var express = require('express');
var htmlparser = require('htmlparser2');
var otgbase = require('./otg-base')

var router = express.Router();

// Use htmlparser2 to parse HTML code of "htmlcode" which get from website ID:240.
function parseHtml_240(link, htmlcode) {
  // errcode = -2 means some error happened on this processing.
  var resObj = { errcode : -2 };

  var domHandler = new htmlparser.DomHandler( function(err, dom) {
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
      var tmpChild = otgbase.getChildObjectByTag(dom, 'html');
      tmpChild = otgbase.getChildObjectByTag(tmpChild, 'body');
      tmpChild = otgbase.getChildObjectByID(tmpChild, 'div', 'wrapper');
      tmpChild = otgbase.getChildObjectByClass(tmpChild, 'div', 'content_read');
      var box_con = otgbase.getChildObjectByClass(tmpChild, 'div', 'box_con');
      // get Title according to the title's css/path.
      tmpChild = otgbase.getChildObjectByClass(box_con, 'div', 'bookname');
      tmpChild = otgbase.getChildObjectByTag(tmpChild, 'h1');
      var txtContent = otgbase.getContentText(tmpChild);
      // get Content according to the content's css/path.
      tmpChild = otgbase.getChildObjectByID(box_con, 'div', 'content');
      txtContent += '\r\n\r\n' + otgbase.getContentText(tmpChild);

      // save to TXT file.
      var strFilename = otgbase.saveTXTfile('./public/txt/' + otgbase.getTXTFilename(link), txtContent);

      // Get Next chapters link
      tmpChild = otgbase.getChildObjectByClass(box_con, 'div', 'bottem2');
      var strNextLink = otgbase.getNextByTagA(link, tmpChild);

      // Return txt filename, next link, errcode = 0 means successful processing.
      // console.log('parseHtml_240() Return Value: ' + strFilename + ',' + strNextLink);
      resObj = { filename: strFilename, nextlink: strNextLink, errcode: 0 };
    }
  });
  var parser = new htmlparser.Parser(domHandler, {decodeEntites : true});
  parser.parseComplete(htmlcode);
  return resObj;
}

/* GET website ID "240" */
router.get('/240', function(req, res, next) {
  otgbase.GetHtmlCode(req.query.link, function(body) {
    // Return txt filename, next link and errcode.
    res.json(JSON.stringify(parseHtml_240(req.query.link, body)));
  }, function(err) {
    console.log(err);
    // Return errcode = -1 means failed processing.
    res.json(JSON.stringify({ errcode : -1 }));
  });
});

module.exports = router;