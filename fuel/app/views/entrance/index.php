<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>online meeting</title>
	<?php echo Asset::css('bootstrap.css'); ?>
	<?php echo Asset::css('entrance.css'); ?>
	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.8/jquery.min.js"></script>
</head>
<body>
	<div class="wrapper">
		<div class="login">
			<form class="formset" action="/room/index" method="post" accept-charset="utf-8">
				<input name="user" type="text" value="" placeholder="アカウント" /><br>
				<input name="password" type="password" value="" placeholder="パスワード" /><br>
				<input name="name" type="hidden" value="<?= $name ?>" /><br>
				<button class="round_c_button" type="submit" >入室</button>
			</form>
		</div>
	</div>
</body>
</html>
