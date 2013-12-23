/**
 * 音声
 */
/* ドキュメントには var recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
 * って書いてあるけど、これだと SpeechRecognition オブジェクトが生成されない
 */
var recognition = window.SpeechRecognition || new webkitSpeechRecognition();
recognition.continuous = false;   // 使い勝手に応じて変更
recognition.lang = "ja-JP";
recognition.onresult = function(event) {
  var length = event.results.length;
  var word = event.results[length-1][0].transcript;
  $("#text").val(word);;
}

function startSpeech() {
  recognition.start();
}
function stopSpeech() {
  recognition.stop();
}