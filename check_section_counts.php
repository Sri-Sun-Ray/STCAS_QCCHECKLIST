<?php
$c=new mysqli('localhost','root','Hbl@1234','station_info');
if($c->connect_error){echo 'CONNERR:'.$c->connect_error.PHP_EOL; exit(1);} 
$stations=[5656,8686,46556,67456,123456,345566,354554,354565,576753,674565,876876,6576667,6876767,25285282,34566775,75687875,757867867];
foreach($stations as $s){
    $q=$c->query("SELECT SUBSTRING_INDEX(S_no,'.',1) as section, COUNT(*) as cnt FROM (
        SELECT S_no FROM verification_of_equipment_serial_numbers WHERE station_id='$s' 
        UNION ALL SELECT S_no FROM tower WHERE station_id='$s'
        UNION ALL SELECT S_no FROM rtu WHERE station_id='$s'
        UNION ALL SELECT S_no FROM rf_antennas WHERE station_id='$s'
        UNION ALL SELECT S_no FROM installation_of_kavach_equipment WHERE station_id='$s'
        UNION ALL SELECT S_no FROM networking_rack WHERE station_id='$s'
        UNION ALL SELECT S_no FROM ips WHERE station_id='$s'
        UNION ALL SELECT S_no FROM dc_convertor WHERE station_id='$s'
        UNION ALL SELECT S_no FROM pdu WHERE station_id='$s'
        UNION ALL SELECT S_no FROM smocip WHERE station_id='$s'
        UNION ALL SELECT S_no FROM outdoor_cabling WHERE station_id='$s'
        UNION ALL SELECT S_no FROM relay_rack WHERE station_id='$s'
        UNION ALL SELECT S_no FROM riu WHERE station_id='$s'
        UNION ALL SELECT S_no FROM laying_of_sectional_ofc_cable WHERE station_id='$s'
        UNION ALL SELECT S_no FROM gps_gsm_antenna WHERE station_id='$s'
        UNION ALL SELECT S_no FROM rfid_tags WHERE station_id='$s'
        UNION ALL SELECT S_no FROM tag_to_tag_distance WHERE station_id='$s'
    ) AS u GROUP BY section");
    echo "station $s\n";
    while($r=$q->fetch_assoc()){
        echo "  section ".$r['section'].'='.$r['cnt']."\n";
    }
}
$c->close();
