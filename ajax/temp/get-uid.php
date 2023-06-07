<?php
date_default_timezone_set("America/Sao_Paulo");

$temp0 = array(
    "CARLITA",
    "ONÍRIA",
    "OLATA",
    "POLÁRIA",
    "LUREMA",
    "TRABACA",
    "FRÔNIA",
    "HUNDIRA"
);

$temp1 = array(
    "SOARES",
    "DA SILVA",
    "UMUARAMA",
    "PTERODÁTILO",
    "HEPATITE",
    "GOOGLE",
    "SALGADO",
    ""
);

$temp2 = array(
    "ROCHEDO",
    "CATAPORA",
    "VOADORA",
    "FIGUEIRA",
    "ROSEIRA"
);

$temp3 = array(
    "COZINHEIRA",
    "FAXINEIRA",
    "TELEFONISTA",
    "DENTISTA",
    "MÚSICA",
    "PINTORA",
    "FISICULTURISTA",
    "MÉDICA",
    "VETERINÁRIA"
);

$temp4 = rand(18, 90);

$format = "%01.2f";
$temp5 = sprintf($format, (100+rand(0, 100))/100);

$temp = 
    $temp0[rand(0, count($temp0)-1)] . " " .
    $temp1[rand(0, count($temp1)-1)] . " " .
    $temp2[rand(0, count($temp2)-1)];

$uid = rand(0, 100000000);
$d0 = rand(0, 9);
$d1 = rand(0, 9);

$uid = $uid.$d0.$d1;

$format = "%'.011d";
$uid = sprintf($format, $uid);

$format = "%01.2f";
$value = "R$ ".sprintf($format, rand(0, 100)/100);

$array = array(
   "timestamp" => date("d/m/Y == H:i:s"),
   "temp" => $temp,
   "temp1" => $value,
   "temp2" => $temp3[rand(0, count($temp3)-1)],
   "temp3" => $temp4,
   "temp4" => $temp5,
   "uid" => $uid,
   //str_pad($uid, 11, "0", STR_PAD_LEFT)
   // “
   // ”
);
echo json_encode($array);
?>