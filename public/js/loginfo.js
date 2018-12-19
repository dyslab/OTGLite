/* eslint-disable no-undef */
// JQuery:
$(document).ready(function () {
  $('#btnViewLog').click(function () {
    $.get('/log/view/', { logfile: $('#opLogfile').val() }, function (data) {
      $('#taLog').text(data)
      $('#taLog').scrollTop(data.length) // Set Scroll Bar's position to the end of the log text.
    })
  })
})
