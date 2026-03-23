<?php
$c=new mysqli("localhost","root","Hbl@1234","station_info");
if($c->connect_error){echo "CONNERR:".$c->connect_error.PHP_EOL; exit(1);} 
$q=$c->query("SELECT COUNT(*) AS total_rows FROM verification_of_equipment_serial_numbers WHERE station_id='6787'"); $r=$q->fetch_assoc(); echo "section1=".$r['total_rows'].PHP_EOL;
$q2=$c->query("SELECT COUNT(*) AS total_row_templates FROM row_templates"); $r2=$q2->fetch_assoc(); echo "row_templates=".$r2['total_row_templates'].PHP_EOL;
$q3=$c->query("SELECT S_no, COUNT(*) AS cnt FROM verification_of_equipment_serial_numbers WHERE station_id='6787' GROUP BY S_no ORDER BY S_no LIMIT 40"); while($ro=$q3->fetch_assoc()){echo $ro['S_no'].'='.$ro['cnt'].PHP_EOL;} 
$c->close();
