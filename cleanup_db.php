<?php
$conn = new mysqli("localhost", "root", "Hbl@1234", "station_info");
if ($conn->connect_error) { die("Connection failed"); }

// Delete duplicates, keep the one with max ID
$sql = "DELETE t1 FROM row_templates t1
        INNER JOIN row_templates t2 
        WHERE t1.id < t2.id AND t1.s_no = t2.s_no AND t1.section_id = t2.section_id";

if ($conn->query($sql) === TRUE) {
    echo "Duplicates deleted successfully";
} else {
    echo "Error deleting duplicates: " . $conn->error;
}
$conn->close();
?>
