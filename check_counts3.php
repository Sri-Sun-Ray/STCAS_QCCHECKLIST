<?php
$c=new mysqli('localhost','root','Hbl@1234','station_info');
if($c->connect_error){echo 'CONNERR:'.$c->connect_error.PHP_EOL;exit(1);} 
$q=$c->query('SELECT station_id, COUNT(*) as c FROM verification_of_equipment_serial_numbers GROUP BY station_id HAVING c>42');
while($r=$q->fetch_assoc()){ echo $r['station_id'].'='.$r['c'].PHP_EOL; }
$c->close();
