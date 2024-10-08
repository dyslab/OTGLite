/* eslint-disable no-undef */
//  JQuery:
$(document).ready(function () {
  $('#tbBook').on('click', 'tr#trBook', function () {
    $('input[name=bookid]:radio').eq($(this).index() - 1).prop('checked', true)
  })

  $('#btnExport').click(function () {
    if ($('input[name=bookid]:radio:checked').val()) {
      window.location.href = '/db/export/' + encodeURIComponent($('input[name=bookid]:radio:checked').val())
    } else {
      window.alert('Note: No book was selected.')
    }
  })

  $('#btnRemove').click(function () {
    if ($('input[name=bookid]:radio:checked').val()) {
      if (window.confirm('Notice: This action is in risk.\r\nPlease confirm if you really want to remove all files?')) {
        window.location.href = '/db/remove/' + encodeURIComponent($('input[name=bookid]:radio:checked').val())
      }
    } else {
      window.alert('Note: No book was selected.')
    }
  })
})
