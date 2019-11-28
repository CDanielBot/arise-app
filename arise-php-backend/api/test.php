<?php

header('Access-Control-Allow-Origin: *');
// header('Access-Control-Allow-Methods: GET, POST');
// header('content-type: application/json; charset=utf-8');

ini_set('display_errors', 1);
error_reporting(E_ALL);

$params = json_decode(file_get_contents('php://input'),true);

echo json_encode('test');

?>
