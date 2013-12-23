<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>online meeting</title>
	<?php echo Asset::css('bootstrap.css'); ?>
	<?php echo Asset::css('room.css'); ?>
	<?php echo Asset::js('jquery.min.js'); ?>
	<script src="https://skyway.io/dist/0.3/peer.js"></script>
	<?php echo Asset::js('room.js'); ?>
	<?php echo Asset::js('room_speech.js'); ?>
</head>
<body>
	<div class="wrapper">
		<article>
			<header>
				<h1 class="title"><?= $name ?> ミーテングルーム</h1>
				<p><span id="user_name"><?= $user ?></span>: <span id="pid"></span></p>
			</header>
			
			<!-- つながっている人表示 -->
			<section id="members">
			</section>
			
			
			<!-- つなげる -->
			<!-- TODO: 自動化する -->
			<section class="do_connect">
				<input class="input_text" type="text" id="rid" placeholder="Someone else's id">
				<input class="button" type="button" value="Connect" id="connect">
				<div id="messages"></div>
			</section>
			
			<!-- CSS -->
			<sction id="css_edit"> <!--  TODO: 中身 -->
				<textarea class="input_text edit_area" pleceholder="CSS"></textarea>
				<input class="button" type="button" value="確定" />
			</sction>
			
			<!-- slide -->
			<section id="slide_sec">
				<div class="slide">
				</div>
			</section>
			
			<!-- 音声 -->
			<audio id="call" autoplay></audio>
			<audio id="call1" autoplay></audio>
			
			<!-- chat -->
			<section id="chat_sec">
				<div id="form">
					<form id="chat_form">
						<input class="input_text" type="text" id="text" placeholder="message" autocomplete="off">
						<button class="button speech" onclick="startSpeech()"><?php echo Asset::img('speech_b.png', array('height'=>'80%', 'alt'=>'音声入力')); ?></button>
						<input id="send" class="button" type="submit" value="Send">
					</form>
					<!-- ファイル送信 -->
					<div id="file_box">
						送りたいファイルをドラッグ
					</div>
				</div>
			</section>
			
		</article>
	</div>
</body>
</html>
