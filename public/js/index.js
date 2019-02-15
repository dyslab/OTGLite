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
    if (link.search(/www.xiaoshuo240.cn/i) >= 0) {
      return '/240'
    } else if (link.search(/www.qingyunian.net/i) >= 0) {
      return '/qingyunian'
    } else if (link.search(/m.biqugex.com/i) >= 0) {
      return '/biqugex'
    } else if (link.search(/m.booktxt.net/i) >= 0) {
      return '/booktxt'
    } else if (link.search(/m.wangshu.la/i) >= 0) {
      return '/wangshu'
    } else if (link.search(/xinshubao.net/i) >= 0) {
      return '/xsb'
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
            $('#txtOtg').val(getBaseLink(link) + res.nextlink)
          }
          grabee(getBaseLink(link) + res.nextlink, saveto, counter + 1, number)
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
