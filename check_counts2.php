<?php
$c=new mysqli('localhost','root','Hbl@1234','station_info');
if($c->connect_error){echo 'CONNERR:'.$c->connect_error.PHP_EOL; exit(1);}
$tables=['verification_of_equipment_serial_numbers','tower','rtu','rf_antennas','installation_of_kavach_equipment','networking_rack','ips','dc_convertor','pdu','smocip','outdoor_cabling','relay_rack','riu','laying_of_sectional_ofc_cable','gps_gsm_antenna','rfid_tags','tag_to_tag_distance'];
$total=0;
foreach($tables as $t){
    $q=$c->query("SELECT COUNT(*) AS c FROM $t WHERE station_id='6787'");
    $r=$q->fetch_assoc();
    echo "$t=".$r['c'].PHP_EOL;
    $total += (int)$r['c'];
}
echo "TOTALROWS=".$total.PHP_EOL;
$c->close();
