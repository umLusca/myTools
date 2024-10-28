<?php

function sendTelegram($Message, $ApiToken, $ChatID): false|string
{
	$apiURL = "https://api.telegram.org/bot{$ApiToken}/sendMessage?";
	$param = [
		'chat_id'    => $ChatID,
		'text'       => $Message,
		'parse_mode' => 'html',
		//	'disable_web_page_preview' => false,
	];
	return file_get_contents($apiURL . http_build_query($param));
	
}



