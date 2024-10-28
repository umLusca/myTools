<?php


function con($user,$pass,$db,$host): PDO
{
	
	$pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$pdo->query("SET time_zone = '-04:00';");
	return $pdo;
}

