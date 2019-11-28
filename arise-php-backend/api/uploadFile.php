<?php

header('Access-Control-Allow-Origin: *');
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

function compress_image($source_url, $destination_url, $quality) {
	// ini_set('display_errors', 1);
	// ini_set('display_startup_errors', 1);
	// error_reporting(E_ALL);
	$info = getimagesize($source_url);
	if ($info['mime'] == 'image/jpeg') {
		$image = imagecreatefromjpeg($source_url);
	}
	else if ($info['mime'] == 'image/gif') {
		$image = imagecreatefromgif($source_url);
	}
	else if ($info['mime'] == 'image/png') {
		$image = imagecreatefrompng($source_url);
	}
	imagejpeg($image, $destination_url, $quality);
	return $destination_url;
}

if (($_FILES["file"]["type"] == "image/gif") || ($_FILES["file"]["type"] == "image/jpeg") || ($_FILES["file"]["type"] == "image/png") || ($_FILES["file"]["type"] == "image/pjpeg")) {

	if(isset($_POST["filePath"])) {
		$url = "../".$_POST["filePath"];
	}
	else {
		$url = "../img/users/".$_POST['fileName'];
	}

	if ($_FILES['file']['size'] < 524288) {
		$filename = compress_image($_FILES["file"]["tmp_name"], $url, 90); // 100 90
	}
	else if ($_FILES['file']['size'] < 1048576) {
		$filename = compress_image($_FILES["file"]["tmp_name"], $url, 90); // 100 85
	}
	else if ($_FILES['file']['size'] < 2097152) {
		$filename = compress_image($_FILES["file"]["tmp_name"], $url, 90); // 100 80
	}
	else {
		$filename = compress_image($_FILES["file"]["tmp_name"], $url, 90); // 100 75
	}

	$size = getimagesize($url);
	if($size['0'] > 1130) {
		$width = $size['0'];
		$height = $size['1'];
		$resized_width = 1130;
		$resized_height = round($resized_width*$size[1]/$size[0]);

		$img = imagecreatefromjpeg($url);
		$img_base = imagecreatetruecolor($resized_width, $resized_height);
		imagecopyresampled($img_base, $img, 0, 0, 0, 0, $resized_width, $resized_height, $width, $height);
		imagejpeg($img_base, $url, 100);
	}
	// else {}

	/*Force download dialog... */
	// header("Content-Type: application/force-download");
	// header("Content-Type: application/octet-stream");
	// header("Content-Type: application/download");

	/* Don't allow caching... */
	// header("Cache-Control: must-revalidate, post-check=0, pre-check=0");

	/* Set data type, size and filename */
	// header("Content-Type: application/octet-stream");
	// header("Content-Transfer-Encoding: binary");
	// header("Content-Length: " . strlen($buffer));
	// header("Content-Disposition: attachment; filename=$url");

	/* Send our file... */

	$result = new stdClass();
    $result->success = true;
    // return json_encode($result)
}
else if(($_FILES["file"]["type"] == "video/mp4") || ($_FILES["file"]["type"] == "audio/mp3") || ($_FILES["file"]["type"] == "audio/wma")) { // && ($_FILES["file"]["size"] < 200000)
	
	if(isset($_POST["filePath"])) {
		$url = "../".$_POST["filePath"];
	}

	move_uploaded_file($_FILES["file"]["tmp_name"], $url); //$_FILES["file"]["name"]
}
else {
	$result = new stdClass();
    $result->success = false;
    $result->errorCode = '1';
    // return json_encode($result)
}
// move_uploaded_file($_FILES['file']['tmp_name'], "../img/users/".$_POST['fileName']);

// $filename = "../img/users/".$_POST['fileName'];
// var_dump($_FILES, $filename, $_FILES['file']['tmp_name']);
// $file = imagecreatefromstring($filename);
// imagepng($file, "../img/users/imagetest11.png");

// var_dump(move_uploaded_file($img, "../img/users/".$_POST['fileName']));

?>


