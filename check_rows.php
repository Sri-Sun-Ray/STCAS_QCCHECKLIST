<?php
$conn = new mysqli("localhost", "root", "Hbl@1234", "station_info");
$res = $conn->query("SELECT COUNT(*) as cnt FROM row_templates");
$row = $res->fetch_assoc();
echo "Custom rows: " . $row['cnt'] . "\n";
$res2 = $conn->query("SELECT * FROM row_templates");
while($r = $res2->fetch_assoc()) {
    echo " - " . $r['s_no'] . ": " . $r['description'] . "\n";
}
?>
