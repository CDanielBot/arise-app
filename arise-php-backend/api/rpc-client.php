<?php
// header('Access-Control-Allow-Origin': '*');
header('Access-Control-Allow-Origin: *');
require_once '../junior/autoload.php';
// header('Access-Control-Allow-Headers': 'Content-Type: application/json');
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

$RPCclient = new Junior\Client('http://'.$_SERVER['SERVER_NAME'].'/api/rpc-server.php');

$rawData = file_get_contents("php://input");

$methods = json_decode($rawData);

$response = null;
if(count($methods) == 1) {
	$paramsArr = array();
	foreach ($methods[0]->params as $key => $value) {
	    $paramsArr[$key] = $value;
	}

	$request = new Junior\Clientside\Request($methods[0]->method, $paramsArr);
	$response = $RPCclient->sendRequest($request);
}
else if(count($methods) > 1) {
	$requests = array();

	foreach ($methods as $method) {
		$paramsArr = array();
		foreach ($method->params as $key => $value) {
		    $paramsArr[$key] = $value;
		}

		$requests[] = new Junior\Clientside\Request($method->method, $paramsArr);
	}

	$response = $RPCclient->sendBatch($requests);

	foreach ($response as $r) {
		$r->result = json_decode($r->result);
	}

	$response = json_encode($response);

}

echo $response;
