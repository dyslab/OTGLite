var domutils = require('domutils');
var fs = require('fs');
const fetch = require('node-fetch');

// Get HTML code from 'link' by node-fetch
// if succeed, call cb()
// else        call errcb()
exports.GetHtmlCode = function(link, cb, errcb) {
    fetch(link)
    .then(fetch_res =>  fetch_res.textConverted())
    .then(body => {
      if (typeof cb === 'function') {
        cb(body);
      }  
    }).catch(err => { 
        errcb(err);
    });
}

// Get Children from node object by tagname.
exports.getChildObjectByTag = function(obj, tagname) {
  for (var i=0; i<obj.length; i++)
    if (obj[i].type === 'tag' && obj[i].name === tagname) {
      return obj[i].children;
    }
}

// Get Children from node object by id.
exports.getChildObjectByID = function(obj, tagname, idname) {
  for (var i=0; i<obj.length; i++)
    if (obj[i].type === 'tag' && obj[i].name === tagname)
      if (domutils.getAttributeValue(obj[i],'id') === idname)
        return obj[i].children;
}

// Get Children from node object by class.
exports.getChildObjectByClass = function(obj, tagname, idname) {
  for (var i=0; i<obj.length; i++) 
    if (obj[i].type === 'tag' && obj[i].name === tagname) 
      if (domutils.getAttributeValue(obj[i],'class') === idname) 
        return obj[i].children;
}

// Get text string from node object. 
exports.getContentText = function(obj) {
  var retText = '';
  for (var i=0; i<obj.length; i++) {
    if (obj[i].type === 'tag' && obj[i].name === 'br') 
      retText = retText + '\r\n';
    if (obj[i].type === 'text') 
      retText = retText + obj[i].data.replace(/&nbsp;/g,' ');
  }

  return retText;
}

// Get Digital filename from 'link' 
function getD(link) {
  var tmpLinkArr = link.split(/\//);
  if (tmpLinkArr.length>0) {
    var tmpF = tmpLinkArr[tmpLinkArr.length-1].split(/\./);
    if(tmpF.length === 2) {
      return parseInt(tmpF[0]);
    }
  } 
  return 0;
}

// Get attribute 'a:href' from node object. 
exports.getNextByTagA = function(link, obj) {
  var nNext, retLink;
  var nThis = getD(link);
  
  for (var i=0; i<obj.length; i++) {
    if (obj[i].type === 'tag' && obj[i].name === 'a') {
      retLink = domutils.getAttributeValue(obj[i],'href');
      nNext = getD(retLink);
      if (nNext>nThis) {
        // console.log('Next Chapters Link Return Value ================>>>>>' + retLink);
        return retLink;
      }
    }
  }
}

// Get filename from the string 'link'.
exports.getTXTFilename = function(link) {
  return getD(link) + '.txt';
}

// Save to the txt file.
exports.saveTXTfile = function(filename, chunk) {
  var retFlag = false;
  const w_stream = fs.createWriteStream(filename);
  if (w_stream.write(chunk) !== false) retFlag = true;
  w_stream.end();

  if(retFlag) return filename;
}