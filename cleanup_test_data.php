<?php
$pdo = new PDO('mysql:host=localhost;dbname=station_info', 'root', 'Hbl@1234', [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
]);

echo "=== Cleaning up test data ===\n\n";

// Delete wrong data (saved with internal ID 106)
echo "Deleting from smocip where station_id=106...\n";
$pdo->prepare("DELETE FROM smocip WHERE station_id = 106")->execute();

echo "Deleting from outdoor_cabling where station_id=106...\n";
$pdo->prepare("DELETE FROM outdoor_cabling WHERE station_id = 106")->execute();

echo "Deleting from relay_rack where station_id=106...\n";
$pdo->prepare("DELETE FROM relay_rack WHERE station_id = 106")->execute();

// Delete corresponding images
echo "Deleting from images where station_id=106...\n";
$pdo->prepare("DELETE FROM images WHERE station_id = 106")->execute();

echo "\n=== Cleanup complete ===\n";
echo "Now you can save sections 11, 12, 13 again with the correct station code (67765876)\n";
?>
