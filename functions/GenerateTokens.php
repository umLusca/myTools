<?php

function generateToken($length): string
{
	$chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	$token = "";
	$usedOnes = [];
	for ($i = 0; $i !== $length; $i++) {
		$random = rand(0, strlen($chars) - 1);
		if (!in_array($chars[$random], $usedOnes) || count($usedOnes) < strlen($chars)) {
			
			$token .= $chars[$random];
			$usedOnes[] = $chars[$random];
		} else {
			$i--;
		}
	}
	return $token;
}

function uuid(): string
{
	// Windows
	if (function_exists('com_create_guid') === true) {
		return trim(com_create_guid(), '{}');
		
	}
	
	// OSX/Linux
	if (function_exists('openssl_random_pseudo_bytes') === true) {
		$data = openssl_random_pseudo_bytes(16);
		$data[6] = chr(ord($data[6]) & 0x0f | 0x40);    // set version to 0100
		$data[8] = chr(ord($data[8]) & 0x3f | 0x80);    // set bits 6-7 to 10
		return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
	}
	
	// Fallback (PHP 4.2+)
	mt_srand((double) microtime() * 10000);
	$charid = strtolower(md5(uniqid(rand(), true)));
	$hyphen = chr(45);                  // "-"
	$lbrace = $trim ? "" : chr(123);    // "{"
	$rbrace = $trim ? "" : chr(125);    // "}"
	$guidv4 = $lbrace .
		substr($charid, 0, 8) . $hyphen .
		substr($charid, 8, 4) . $hyphen .
		substr($charid, 12, 4) . $hyphen .
		substr($charid, 16, 4) . $hyphen .
		substr($charid, 20, 12) .
		$rbrace;
	return $guidv4;
}