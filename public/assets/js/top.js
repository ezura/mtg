$(function () {
  // �y�[�W�J��
  $('.room').click(function() {
    console.log("click");
    window.location.href = '/entrance/index/' + $(this).attr('id');
  });
});