/* eslint-disable no-undef */
// JQuery:
$(document).ready(function () {
  // Get the base link of "http://...".
  function getBaseLink (link) {
    var tmpLinkArr = link.split(/\//)
    return tmpLinkArr.slice(0, 3).join('/')
  }

  // Get website ID by 'link'
  function getWebsiteID (link) {
    if (link.search(/xiaoshuo240.cn/i) >= 0) {
      return '/240'
    } else if (link.search(/qingyunian.net/i) >= 0) {
      return '/qingyunian'
    } else {
      return ''
    }
  }

  // TXT version: Grab online txt.
  function grabee (link, saveto, counter, number) {
    if (counter <= number) {
      // Ajax POST method
      $.get('/otg/' + saveto + getWebsiteID(link), { link: link }, function (json) {
        var res = JSON.parse(json)
        if (res.errcode === 0) {
          if (saveto === 'txt') $('#taOtgRes').val('>>> file [' + res.filename + '] saved.\r\n' + $('#taOtgRes').val())
          else $('#taOtgRes').val('>>> database record [' + res.filename + '] saved.\r\n' + $('#taOtgRes').val())
          $('#taOtgRes').val('=== ready to process next link [' + res.nextlink + '] ===\r\n' + $('#taOtgRes').val())
          grabee(getBaseLink(link) + res.nextlink, saveto, counter + 1, number)
        } else {
          $('#taOtgRes').val('>>> Finish.\r\n>>> process failed. (Note: It may be the last chapter.)\r\n>>> errcode = ' + res.errcode + ', Abort!\r\n' + $('#taOtgRes').val())
        }
      })
    } else {
      $('#taOtgRes').val('>>> Finish.\r\n>>> congratulations! fetched ' + (counter - 1) + ' files successfully.\r\n' + $('#taOtgRes').val())
    }
  }

  $('#btnOtg').click(function () {
    $('#taOtgRes').val('>>> grabee go...')
    grabee($('#txtOtg').val(), $('#opSaveTo').val(), 1, $('#maxPages').val())
  })
})
