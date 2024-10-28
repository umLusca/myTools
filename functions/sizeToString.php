<?php


function getSymbolByQuantity($bytes, bool $returnUnit = true)
{
	$symbols = array('B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB');
	$exp = floor(log($bytes) / log(1024));
	
	return $returnUnit ? sprintf('%.2f ' . $symbols[$exp], ($bytes / (1024 ** floor($exp)))):(float)($bytes / (1024 ** floor($exp)));
}