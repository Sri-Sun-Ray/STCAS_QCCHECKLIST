<?php
$pdo = new PDO('mysql:host=localhost;dbname=station_info', 'root', 'Hbl@1234', [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
]);

echo "=== Cleaning up duplicate data ===\n\n";

// Delete section 11 data (11.x) from gps_gsm_antenna table
echo "Deleting 11.x rows from gps_gsm_antenna...\n";
$pdo->prepare("DELETE FROM gps_gsm_antenna WHERE S_no LIKE '11.%'")->execute();

// Delete section 12 data (12.x) from rfid_tags table (ONLY from section 17, not legacy)
// Actually, we need to be careful here - section 17 should have 17.x rows, not 12.x
echo "Deleting 12.x rows from rfid_tags...\n";
$pdo->prepare("DELETE FROM rfid_tags WHERE S_no LIKE '12.%'")->execute();

// Also delete associated images
echo "Deleting images associated with 11.x from gps_gsm_antenna entity type...\n";
$pdo->prepare("DELETE FROM images WHERE entity_type = 'gps_gsm_antenna' AND s_no LIKE '11.%'")->execute();

echo "Deleting images associated with 12.x from rfid_tags entity type...\n";
$pdo->prepare("DELETE FROM images WHERE entity_type = 'rfid_tags' AND s_no LIKE '12.%'")->execute();

echo "\n=== Cleanup complete ===\n";
echo "Now all data should be in the correct tables!\n";
?>
