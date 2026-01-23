<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$conn = new mysqli("localhost", "root", "Hbl@1234", "station_info");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "Check 1: Tables in DB:\n";
$result = $conn->query("SHOW TABLES LIKE 'row_templates'");
if ($result->num_rows == 0) {
    echo "Table 'row_templates' DOES NOT EXIST.\n";
} else {
    echo "Table 'row_templates' EXISTS.\n";
}

echo "\nCheck 2: Content of row_templates:\n";
if ($result->num_rows > 0) {
    $rows = $conn->query("SELECT * FROM row_templates");
    if ($rows->num_rows > 0) {
        while($row = $rows->fetch_assoc()) {
            print_r($row);
        }
    } else {
        echo "Table is EMPTY.\n";
    }
}
$conn->close();
?>
