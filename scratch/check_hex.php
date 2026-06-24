<?php
$conn = new mysqli("localhost", "root", "Hbl@1234", "station_info");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$res = $conn->query("SELECT id, s_no, description FROM row_templates");
while($row = $res->fetch_assoc()) {
    echo "ID: " . $row['id'] . " | s_no: " . $row['s_no'] . " | description: " . $row['description'] . "\n";
}
$conn->close();
?>
