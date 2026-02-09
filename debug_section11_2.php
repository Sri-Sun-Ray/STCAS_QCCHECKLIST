<?php
$pdo = new PDO('mysql:host=localhost;dbname=station_info', 'root', 'Hbl@1234', [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
]);

echo "=== Checking what's in tables ===\n\n";

// Check images table
echo "Images table (all records):\n";
$query = "SELECT * FROM images WHERE station_id IN (106, 67765876) LIMIT 10";
$stmt = $pdo->prepare($query);
$stmt->execute();
$result = $stmt->fetchAll();
print_r($result);

echo "\n\n=== Check smocip table ===\n";
echo "All smocip records for all station_ids:\n";
$query = "SELECT station_id, S_no, COUNT(*) as count FROM smocip GROUP BY station_id LIMIT 20";
$stmt = $pdo->prepare($query);
$stmt->execute();
$result = $stmt->fetchAll();
print_r($result);

echo "\n\n=== What's the external station code? ===\n";
echo "For station id=106:\n";
$query = "SELECT id, station_id FROM station WHERE id = 106";
$stmt = $pdo->prepare($query);
$stmt->execute();
$result = $stmt->fetch();
print_r($result);
?>
