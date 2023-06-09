<?php
date_default_timezone_set("America/Sao_Paulo");

$pin = rand(0, 9999);

$format = "%'.04d";
$pin = sprintf($format, $pin);

$pin2 = intval(date("H"))*intval(date("d"))*intval(date("m"));
$format = "%'.04d";
$pin2 = sprintf($format, $pin2);

$array = array(
   "pin0" => date("iH"),
   "pin1" => $pin,
   "pin2" => $pin2,
   "timestamp" => date("d/m/Y == H:i:s")
);
echo json_encode($array);
?>