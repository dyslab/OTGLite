var domutils = require('domutils');
var fs = require('fs');
var SortedArray = require("collections/sorted-array");
const fetch = require('node-fetch');
const baseTXTpath = './public/txt/';

// -----------------------------------------------------------------------------
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

// -----------------------------------------------------------------------------
// DOM node object handler
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

// Get attribute 'a:href' from node object. 
exports.getNextByTagA = function(link, obj) {
  var nNext, retLink;
  var nThis = getD(link);
  
  for (var i=0; i<obj.length; i++) {
    if (obj[i].type === 'tag' && obj[i].name === 'a') {
      retLink = domutils.getAttributeValue(obj[i],'href');
      nNext = getD(retLink);
      if (nNext>nThis) {
        // console.log('Next Chapters Link Return Value ===>>>' + retLink);
        return retLink;
      }
    }
  }
}

// -----------------------------------------------------------------------------
// link string handler for website id: 240
// Get Digital filename ID from 'link' 
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

// link string handler for website id: 240
// Get bookfolder ID from 'link' 
function getB(link) {
  var tmpLinkArr = link.split(/\//);
  if (tmpLinkArr.length>1) {
    var tmpF = tmpLinkArr[tmpLinkArr.length-2];
    if(tmpF !== undefined) return tmpF;
  } 
  return 0;
}

// Get filename ID from 'link' 
exports.getFileID = function(link) {
  return getD(link);
}

// link string handler for website id: 240
// Get bookfolder ID from 'link' 
exports.getBookID = function(link) {
  return getB(link);
}

// Get txt filename from the string 'link'.
exports.getTXTFilename = function(link) {
  return baseTXTpath + getB(link) + '-' + getD(link) + '.txt';
}

// -----------------------------------------------------------------------------
// TXT file handler
// Save to the txt file.
exports.savetoTXTfile = function(filename, chunk) {
  var retFlag = false;
  const w_stream = fs.createWriteStream(filename);
  if (w_stream.write(chunk) !== false) retFlag = true;
  w_stream.end();

  if(retFlag) return filename;
}

// Get files amount of baseTXTpath.
exports.getFileCount = function() {
  var dirfiles = fs.readdirSync(baseTXTpath);
  
  if (dirfiles && dirfiles !== 'undefined') {
    return dirfiles.length;
  }
  else return 0;
}

// Export to a single txt file.
exports.exportTXTfile = function() {
  var dirfiles = fs.readdirSync(baseTXTpath);
  var file_buffer = '';
  var tmpdata;

  if (dirfiles && dirfiles !== 'undefined') {
    // get sorted filenames.
    var sortedfilenames = new SortedArray(dirfiles);

    // export all files to buffer. using file synchronous method.
    sortedfilenames.forEach( (filepath) => {
      // check file type.
      if (filepath.search(/.txt/i) > 0) {
        tmpdata = fs.readFileSync(baseTXTpath + filepath, { encoding: 'utf8' });
        if (tmpdata) 
          file_buffer += tmpdata + '\r\n\r\n\r\n';
      }
    });

    return file_buffer;
  }
}

// Remove all txt file in the directory "baseTXTpath".
exports.removeAllFiles = function() {
  var dirfiles = fs.readdirSync(baseTXTpath);
  var removeCount = 0;

  if (dirfiles && dirfiles !== 'undefined') {
    for (var i=0; i<dirfiles.length; i++) {
      // remove/unlink all files to buffer. using file synchronous method.
      fs.unlink(baseTXTpath + dirfiles[i], (err) => {
        if (err) console.log(err);
      });
    }

    return removeCount;
  }
}

// -----------------------------------------------------------------------------
// SQLite DB handler
const baseDBfullpath = './public/sqlitedb/otglite.db';  // SQLite3 Database file


