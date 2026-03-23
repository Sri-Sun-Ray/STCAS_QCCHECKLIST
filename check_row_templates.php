<?php
$c=new mysqli('localhost','root','Hbl@1234','station_info');
if($c->connect_error){echo 'CONNERR:'.$c->connect_error.PHP_EOL; exit(1);}
$q=$c->query('SELECT COUNT(*) AS c FROM row_templates'); $r=$q->fetch_assoc(); echo 'row_templates='.$r['c'].PHP_EOL;
$c->close();
