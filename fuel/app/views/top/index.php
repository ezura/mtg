<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>online meeting</title>
	<?php echo Asset::css('bootstrap.css'); ?>
	<?php echo Asset::css('top.css'); ?>
	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.8/jquery.min.js"></script>
	<?php echo Asset::js('top.js'); ?>
</head>
<body>
	<div class="wrapper">
		<h1 id="title">Online <span>M</span>ee<span>t</span>in<span>g</span></h1>
		<div class="rooms">
			<div class="room" id="gemky">
				<h2>room for</h2>
				<iframe src="http://www.anitype.com/example/?message=gemky&size=100&stroke=black" width="500" height="100" scrolling="no">gemky</iframe>
			</div>
			<div class="room" id="curry">
				<h2>room for</h2>
				<iframe src="http://www.anitype.com/example/?message=curry&size=100&stroke=black" width="500" height="100" scrolling="no">curry</iframe>
			</div>
		</div>
		<div class="entry">
			
		</div>
	</div>
</body>
</html>
