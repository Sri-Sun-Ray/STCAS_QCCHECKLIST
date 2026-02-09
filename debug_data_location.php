<?php
$pdo = new PDO('mysql:host=localhost;dbname=station_info', 'root', 'Hbl@1234', [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
]);

echo "=== Checking where data is being saved ===\n\n";

// Get station 107
$query = "SELECT id, station_id FROM station WHERE id = 107";
$stmt = $pdo->prepare($query);
$stmt->execute();
$station = $stmt->fetch();
echo "Station 107: External ID = " . $station['station_id'] . ", Internal ID = " . $station['id'] . "\n\n";

$stationId = $station['station_id'];

// Check all observation tables for rows starting with 11.x and 12.x
$tables = ['smocip', 'outdoor_cabling', 'relay_rack', 'gps_gsm_antenna', 'rfid_tags'];
foreach ($tables as $table) {
    $query = "SELECT COUNT(*) as count, GROUP_CONCAT(S_no) as s_nos FROM $table WHERE station_id = " . $stationId;
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $result = $stmt->fetch();
    echo "Table '$table': " . $result['count'] . " records - S_nos: " . ($result['s_nos'] ?? 'none') . "\n";
}
?>
