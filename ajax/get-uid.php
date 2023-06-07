<?php
date_default_timezone_set("America/Sao_Paulo");

$uid = rand(0, 100000000);
$d0 = rand(0, 9);
$d1 = rand(0, 9);

$uid = $uid.$d0.$d1;

$format = "%'.011d";
$uid = sprintf($format, $uid);

$array = array(
   "timestamp" => date("d/m/Y == H:i:s"),
   "uid" => $uid
);
echo json_encode($array);
?>