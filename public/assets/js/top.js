$(function () {
  // ƒy[ƒW‘JˆÚ
  $('.room').click(function() {
    console.log("click");
    window.location.href = '/entrance/index/' + $(this).attr('id');
  });
});