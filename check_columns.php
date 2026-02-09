<?php
$conn = new mysqli("localhost", "root", "Hbl@1234", "station_info");
if ($conn->connect_error) { die("Connection failed: " . $conn->connect_error); }

$table = "verification_of_equipment_serial_numbers";
$result = $conn->query("DESCRIBE $table");

$columns = [];
while($row = $result->fetch_assoc()) {
    $columns[] = $row['Field'];
}

echo json_encode($columns);
$conn->close();
?>
