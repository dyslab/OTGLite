/* eslint-disable no-undef */
// JQuery:
$(document).ready(function () {
  // Get the base link of "http://...".
  function getBaseLink (link) {
    try {
      const url = new URL(link)
      return `${url.protocol}//${url.hostname}`  
    } catch (err) {
      console.log(err)
      return null
    }
  }

  // Get website ID by 'link'
  function getWebsiteID (link) {
    if (link.search(/www.qingyunian.net/i) >= 0) {
      return '/qingyunian'
    } else if (link.search(/m.biqugex.com/i) >= 0 
    || link.search(/m.xbiqugex.cc/i) >= 0 
    || link.search(/m.ddyueshu.cc/i) >= 0) {
      return '/biqugex'
    } else if (link.search(/ghost580.com/i) >= 0) {
      return '/ghost580'
    } else {
      return ''
    }
  }

  // TXT version: Grab online txt.
  function grabee (link, saveto, counter, number) {
    var webid = getWebsiteID(link)

    if (webid === '') {
      $('#taOtgRes').val('! This webpage is yet to support.\r\n' + $('#taOtgRes').val())
      return
    }

    if (counter <= number) {
      // Ajax POST method
      $('#taOtgRes').val('* ready to process the link [' + link + ']\r\n' + $('#taOtgRes').val())
      $.get('/otg/' + saveto + webid, { link: link }, function (json) {
        var res = JSON.parse(json)
        if (res.errcode === 0) {
          if (saveto === 'txt') $('#taOtgRes').val('> file [' + res.filename + '] saved.\r\n' + $('#taOtgRes').val())
          else $('#taOtgRes').val('> database record [' + res.filename + '] saved.\r\n' + $('#taOtgRes').val())
          if (res.nextlink && res.nextlink !== undefined) {
            let next_link = res.nextlink
            if (res.nextlink.match(/^http[s]?:\/\//) === null) {
              next_link = getBaseLink(link) + next_link
            } 
            $('#txtOtg').val(next_link)
            grabee(next_link, saveto, counter + 1, number)
          }
        } else {
          if (saveto === 'txt') $('#taOtgRes').val('> file [' + res.filename + '] saved.\r\n' + $('#taOtgRes').val())
          else $('#taOtgRes').val('> database record [' + res.filename + '] saved.\r\n' + $('#taOtgRes').val())
          $('#taOtgRes').val('> Finish.\r\n> process failed. (Note: It may be the last chapter.)\r\n> errcode = ' + res.errcode + ', Abort!\r\n' + $('#taOtgRes').val())
        }
      })
    } else {
      $('#taOtgRes').val('> Finish.\r\n> congratulations! fetched ' + (counter - 1) + ' files successfully.\r\n' + $('#taOtgRes').val())
    }
  }

  $('#btnOtg').click(function () {
    $('#taOtgRes').val('> grabee go...')
    grabee($('#txtOtg').val(), $('#opSaveTo').val(), 1, $('#maxPages').val())
  })
})
