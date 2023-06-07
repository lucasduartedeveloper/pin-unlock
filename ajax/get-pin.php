<?php
date_default_timezone_set("America/Sao_Paulo");

$pin = rand(0, 9999);

$format = "%'.04d";
$pin = sprintf($format, $uid);

$array = array(
   "pin" => date("iH"), //$pin,
   "timestamp" => date("d/m/Y == H:i:s")
);
echo json_encode($array);
?>