<?php

function relativeDate($datetime, $full = false)
{
	$ago = DateTime::createFromFormat("Y-m-d H:i:s", $datetime);
	$now = new DateTime;
	$diff = $now->diff($ago);
	
	$diff->w = floor($diff->d / 7);
	$diff->d -= $diff->w * 7;
	
	
	$string = array(
		'y' => 'ano',
		'm' => 'm',
		'w' => 'semana',
		'd' => 'dia',
		'h' => 'hora',
		'i' => 'minuto',
		's' => 'segundo',
	);
	foreach ($string as $k => &$v) {
		if ($diff->$k) {
			
			
			$v = $diff->$k . ' ' . $v . (($k === 'm') ? ($diff->$k > 1 ? 'eses' : 'ês') : ($diff->$k > 1 ? 's' : ''));
			
		} else {
			unset($string[$k]);
		}
	}
	
	if (!$full) $string = array_slice($string, 0, 1);
	return $string ? implode(', ', $string) . ' atrás' : 'Agora';
}
