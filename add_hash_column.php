<?php
$conn = new mysqli("localhost", "root", "Hbl@1234", "station_info");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Add last_uploaded_hash column to report table
$sql = "ALTER TABLE report ADD COLUMN last_uploaded_hash VARCHAR(64) DEFAULT NULL";
if ($conn->query($sql)) {
    echo "Successfully added 'last_uploaded_hash' column to 'report' table.";
} else {
    echo "Error adding column: " . $conn->error;
}

$conn->close();
?>
