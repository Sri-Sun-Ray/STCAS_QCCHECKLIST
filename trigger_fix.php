<?php
include 'manage_row_templates.php';
$conn = new mysqli("localhost", "root", "Hbl@1234", "station_info");
realignCustomRows($conn, '2_0');
echo "Done! 1.70 should now be 1.69 in Section 2_0.\n";
?>
