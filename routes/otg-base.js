var domutils = require('domutils')
var fs = require('fs')
var SortedArray = require('collections/sorted-array')
const fetch = require('node-fetch')
const baseTXTpath = './public/txt/'
const baseLOGpath = './public/log/'
const Database = require('better-sqlite3')
const baseDBfullpath = './public/sqlitedb/otglite.db' // SQLite3 Database file

// -----------------------------------------------------------------------------
// Get HTML code from 'link' by node-fetch
// if succeed, call cb()
// else        call errcb()
exports.GetHtmlCode = function (link, cb, errcb) {
  fetch(link, {
    headers:
    {
      'Referer': link,
      'Cahce-Control': 'max-age=0',
      'Connection': 'keep-alive',
      'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:64.0) Gecko/20100101 Firefox/64.0'
    }
  }).then(fetchres => fetchres.textConverted())
    .then(body => {
      if (typeof cb === 'function') { cb(body) }
    }).catch(err => { errcb(err) })
}

// remove baseURL
exports.removeBaseURL = function (link) {
  var arrNextLink = link.split(/\//)
  arrNextLink.splice(0, 3)
  return '/' + arrNextLink.join('/')
}

// -----------------------------------------------------------------------------
// DOM node object handler
// Get Children from node object by tagname.
exports.getChildObjectByTag = function (obj, tagname) {
  for (var i = 0; i < obj.length; i++) {
    if (obj[i].type === 'tag' && obj[i].name === tagname) {
      return obj[i].children
    }
  }
}

// Get Children from node object by tagname and index no.
exports.getChildObjectByTagIndex = function (obj, tagname, indexno) {
  var idno = 0
  for (var i = 0; i < obj.length; i++) {
    if (obj[i].type === 'tag' && obj[i].name === tagname) {
      idno++
      if (idno === indexno) return obj[i].children
    }
  }
}

// Get Children from node object by id name.
exports.getChildObjectByID = function (obj, tagname, idname) {
  for (var i = 0; i < obj.length; i++) {
    if (obj[i].type === 'tag' && obj[i].name === tagname) {
      if (domutils.getAttributeValue(obj[i], 'id') === idname) {
        return obj[i].children
      }
    }
  }
}

// Get Children from node object by class name.
exports.getChildObjectByClass = function (obj, tagname, classname) {
  for (var i = 0; i < obj.length; i++) {
    if (obj[i].type === 'tag' && obj[i].name === tagname) {
      if (domutils.getAttributeValue(obj[i], 'class') === classname) {
        return obj[i].children
      }
    }
  }
}

// Get Children from node object by class name and index no.
exports.getChildObjectByClassIndex = function (obj, tagname, classname, indexno) {
  var idno = 0
  for (var i = 0; i < obj.length; i++) {
    if (obj[i].type === 'tag' && obj[i].name === tagname) {
      if (domutils.getAttributeValue(obj[i], 'class') === classname) {
        idno++
        if (idno === indexno) return obj[i].children
      }
    }
  }
}

// Get text string from node object.
exports.getContentText = function (obj) {
  var retText = ''
  for (var i = 0; i < obj.length; i++) {
    if (obj[i].type === 'tag' && obj[i].name === 'br') {
      retText = retText + '\n'
    }
    if (obj[i].type === 'text') {
      retText = retText + obj[i].data.replace(/&nbsp;/g, ' ')
    }
  }

  return retText
}

// Get text string from child node object selected by 'tagname'
exports.getContentTextFromChildTag = function (obj, tagname) {
  var retText = ''
  for (var i = 0; i < obj.length; i++) {
    if (obj[i].type === 'tag' && obj[i].name === tagname) {
      retText = retText + this.getContentText(obj[i].children)
    }
    if (obj[i].type === 'text') {
      retText = retText + obj[i].data.replace(/&nbsp;/g, ' ')
    }
  }

  return retText
}

// Get child object by child nodes 'tagname' and 'searchtext'.
exports.getChildObjectByChildTagText = function (obj, tagname, searchtext) {
  var retText = ''
  for (var i = obj.length - 1; i >= 0; i--) {
    if (obj[i].type === 'tag' && obj[i].name === tagname) {
      retText = this.getContentText(obj[i].children)
      if (retText.search(searchtext) >= 0) {
        return obj[i].children
      }
    }
  }
}

// Get attribute 'a:href' from node object.
exports.getNextByTagA = function (link, obj) {
  var nNext, retLink
  var nThis = getD(link)
  for (var i = 0; i < obj.length; i++) {
    if (obj[i].type === 'tag' && obj[i].name === 'a') {
      retLink = domutils.getAttributeValue(obj[i], 'href')
      nNext = getD(retLink)
      if (nNext >= nThis) {
        // console.log('Next Chapters Link Return Value ===>>>' + retLink)
        return retLink
      }
    }
  }
}

// Get attribute 'a:href' from node object which index number is 'indexno'.
exports.getNextByTagAIndex = function (link, obj, indexno) {
  var idno = 0
  for (var i = 0; i < obj.length; i++) {
    if (obj[i].type === 'tag' && obj[i].name === 'a') {
      idno++
      if (idno === indexno) {
        var retLink = domutils.getAttributeValue(obj[i], 'href')
        return retLink
      }
    }
  }
}

// Get attribute 'a:href' from node object which id name is 'idname'
exports.getNextByTagAID = function (link, obj, idname) {
  var nNext, retLink
  var nThis = getD(link)
  for (var i = 0; i < obj.length; i++) {
    if (obj[i].type === 'tag' && obj[i].name === 'a') {
      if (domutils.getAttributeValue(obj[i], 'id') === idname) {
        retLink = domutils.getAttributeValue(obj[i], 'href')
        nNext = getD(retLink)
        if (nNext >= nThis) {
          // console.log('Next Chapters Link Return Value ===>>>' + retLink)
          return retLink
        }
      }
    }
  }
}

// Get attribute 'a:href' from node object which class name is 'classname'
exports.getNextByTagAClass = function (link, obj, classname) {
  var nNext, retLink
  var nThis = getD(link)
  for (var i = 0; i < obj.length; i++) {
    if (obj[i].type === 'tag' && obj[i].name === 'a') {
      if (domutils.getAttributeValue(obj[i], 'class') === classname) {
        retLink = domutils.getAttributeValue(obj[i], 'href')
        nNext = getD(retLink)
        if (nNext > nThis) {
          // console.log('Next Chapters Link Return Value ===>>>' + retLink)
          return retLink
        }
      }
    }
  }
}

// -----------------------------------------------------------------------------
// link string handler for website
// Get Digital filename ID from 'link'
function getD (link) {
  var tmpLinkArr = link.split(/\//)
  if (tmpLinkArr.length > 0) {
    var tmpF = tmpLinkArr[tmpLinkArr.length - 1].split(/\./)
    if (tmpF.length === 2) {
      return parseInt(parseFloat(tmpF[0].replace(/_/, '.')) * 100)
    }
  }
  return 0
}

// link string handler for website
// Get bookfolder ID from 'link'
function getB (link) {
  var tmpLinkArr = link.split(/\//)
  if (tmpLinkArr.length > 1) {
    var tmpF = tmpLinkArr[tmpLinkArr.length - 2]
    if (tmpF !== undefined) return tmpF
  }
  return 0
}

// Get filename ID from 'link'
exports.getFileID = function (link) {
  return getD(link)
}

// link string handler for website id: 240
// Get bookfolder ID from 'link'
exports.getBookID = function (link) {
  return getB(link)
}

// Get txt filename from the string 'link'.
exports.getTXTFilename = function (link) {
  return baseTXTpath + getB(link) + '-' + getD(link) + '.txt'
}

// -----------------------------------------------------------------------------
// TXT file handler
// Save fetched text to the txt file.
exports.savetoTXTfile = function (filename, chunk) {
  var retFlag = false
  const wstream = fs.createWriteStream(filename)
  if (wstream.write(chunk) !== false) retFlag = true
  wstream.end()

  if (retFlag) return filename
}

// Get files amount of baseTXTpath.
exports.getFileCount = function () {
  var dirfiles = fs.readdirSync(baseTXTpath)
  if (dirfiles && dirfiles !== 'undefined') return dirfiles.length
  else return 0
}

// Export to a single txt file.
exports.exportTXTfile = function () {
  var dirfiles = fs.readdirSync(baseTXTpath)
  var filebuffer, tmpdata

  if (dirfiles && dirfiles !== 'undefined') {
    // get sorted filenames.
    var sortedfilenames = new SortedArray(dirfiles)

    // export all files to buffer. using file synchronous method.
    sortedfilenames.forEach((filepath) => {
      // check file type.
      if (filepath.search(/.txt/i) > 0) {
        tmpdata = fs.readFileSync(baseTXTpath + filepath, { encoding: 'utf8' })
        if (tmpdata) filebuffer += tmpdata + '\n\n\n'
      }
    })

    return filebuffer
  }
}

// Remove all txt file in the directory "baseTXTpath".
exports.removeAllFiles = function () {
  var dirfiles = fs.readdirSync(baseTXTpath)
  var removeCount = 0

  if (dirfiles && dirfiles !== 'undefined') {
    for (var i = 0; i < dirfiles.length; i++) {
      // remove/unlink all files to buffer. using file synchronous method.
      fs.unlink(baseTXTpath + dirfiles[i], (err) => {
        if (err) console.log(err)
      })
    }

    return removeCount
  }
}

// -----------------------------------------------------------------------------
// SQLite DB handler

// Save fetched text to the database.
exports.savetoDB = function (bookid, pageid, chunk) {
  const db = new Database(baseDBfullpath)
  var changecount = 0
  try {
    const insertdb = db.prepare('INSERT INTO otgdata(bookid, pageid, text) values(?, ?, ?)')
    const insertinfo = insertdb.run(bookid, pageid, chunk)
    changecount = insertinfo.changes
  } catch (err) {
    // console.log(err)
    // If the records existed due to the unique conflict, hand over to update method.
    const updatedb = db.prepare('UPDATE otgdata SET text=?, updatetime=CURRENT_TIMESTAMP WHERE bookid=? AND pageid=?')
    const updateinfo = updatedb.run(chunk, bookid, pageid)
    changecount = updateinfo.changes
  }
  return bookid + '/' + pageid + ', ' + changecount + ' record(s)'
}

// Check out the database and automatically create the database file and tables if it doesn't existed.
exports.checkoutDatabase = function () {
  const db = new Database(baseDBfullpath)
  var ret = 0
  var retData
  try {
    const rd1 = db.prepare('SELECT COUNT(bookid) AS count FROM otgdata')
    ret = rd1.get().count
    const rd2 = db.prepare('SELECT DISTINCT bookid, COUNT(pageid) as pages FROM otgdata GROUP BY bookid ORDER BY updatetime DESC')
    retData = rd2.all()
    // console.log(retData)
  } catch (err) {
    db.close()
    fs.unlinkSync(baseDBfullpath)

    // Create the database file and tables if it doesn't existed.
    const newdb = new Database(baseDBfullpath)
    const stmt = newdb.prepare('CREATE TABLE IF NOT EXISTS otgdata(bookid VAR(50), pageid VAR(50), text TEXT, updatetime TEXT DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(bookid, pageid))')
    stmt.run()
    newdb.close()
  }
  return { recordcount: ret, bookdata: retData }
}

// Export to a single txt file from database by 'bookid'
exports.exportTXTfileFromDB = function (bookid) {
  const db = new Database(baseDBfullpath)
  var filebuffer = ''

  try {
    const rd = db.prepare('SELECT text FROM otgdata WHERE bookid=? ORDER BY pageid ASC')
    const tmpdata = rd.all(bookid)
    tmpdata.forEach(element => {
      filebuffer += element.text + '\n\n\n'
    })
  } catch (err) {
    console.log(err)
  }

  return filebuffer
}

// Remove records from database by 'bookid'
exports.removeRecordFromDB = function (bookid) {
  const db = new Database(baseDBfullpath)

  try {
    const rd = db.prepare('DELETE FROM otgdata WHERE bookid=?')
    rd.run(bookid)
  } catch (err) {
    console.log(err)
  }
}

// -----------------------------------------------------------------------------
// Save content to file or database by 'saveto'
exports.autoSave = function (link, txtContent, saveto) {
  if (saveto === 'txt') {
    // save to TXT file.
    return this.savetoTXTfile(this.getTXTFilename(link), txtContent)
  } else {
    // save to DB.
    return this.savetoDB(this.getBookID(link), this.getFileID(link), txtContent)
  }
}

// Save content to file or database by 'saveto', manipulate link string firstly.
exports.autoSave2 = function (link, txtContent, saveto) {
  var slink = link.replace(/_/, '/')
  if (saveto === 'txt') {
    // save to TXT file.
    return this.savetoTXTfile(this.getTXTFilename(slink), txtContent)
  } else {
    // save to DB.
    return this.savetoDB(this.getBookID(slink), this.getFileID(slink), txtContent)
  }
}

// -----------------------------------------------------------------------------
// Log file handler

// Format date string like '20180203','2018-12-19', '2018/12/19'...
function formatDate2yyyyMMdd (dateobj, speratechar) {
  return dateobj.getFullYear().toString() + speratechar +
         (dateobj.getMonth() >= 9 ? (dateobj.getMonth() + 1).toString() : '0' + (dateobj.getMonth() + 1).toString()) + speratechar +
         (dateobj.getDate() > 9 ? dateobj.getDate().toString() : '0' + dateobj.getDate().toString())
}

// Format time string like '220230','18:12:30'...
function formatDate2hhmmss (dateobj, speratechar) {
  return (dateobj.getHours() > 9 ? dateobj.getHours().toString() : '0' + dateobj.getHours().toString()) + speratechar +
         (dateobj.getMinutes() > 9 ? dateobj.getMinutes().toString() : '0' + dateobj.getMinutes().toString()) + speratechar +
         (dateobj.getSeconds() > 9 ? dateobj.getSeconds().toString() : '0' + dateobj.getSeconds().toString())
}

// Save info to log file.
exports.savetoLog = function (info) {
  const dd = new Date()
  fs.appendFile(baseLOGpath + formatDate2yyyyMMdd(dd, '') + '.log',
    formatDate2yyyyMMdd(dd, '/') + ' ' + formatDate2hhmmss(dd, ':') + ', ' + JSON.stringify(info) + '\n',
    (err) => {
      if (err) {
        console.log(err)
      }
    })
}

// Get lastest maximum 10 log filenames in the direcoty 'baseLOGpath'.
exports.getLogfilenames = function () {
  var dirfiles = fs.readdirSync(baseLOGpath)

  if (dirfiles && dirfiles !== 'undefined') {
    // get sorted filenames.
    var sortedfilenames = new SortedArray(dirfiles)
    var maxlength = (sortedfilenames.length > 10 ? 10 : sortedfilenames.length)
    sortedfilenames.slice(sortedfilenames.length - maxlength, sortedfilenames.length)
    return sortedfilenames.sorted((left, right) => {
      if (left > right) {
        return -1
      } if (left < right) {
        return 1
      } else {
        return 0
      }
    })
  }
}

// Read log file by 'filename'.
exports.readLogFile = function (filename) {
  return fs.readFileSync(baseLOGpath + filename, { encoding: 'utf8' })
}

// -----------------------------------------------------------------------------
// Cookie handler
exports.writeCookie = function (res, link) {
  // cookies life cycle is 30 days.
  if (link && link !== undefined) res.cookie('nextlink', link, { maxAge: 259200000, httpOnly: true })
}

exports.readCookie = function (req) {
  // cookies life cycle is 30 days.
  return req.cookies === {} ? '' : req.cookies.nextlink
}
