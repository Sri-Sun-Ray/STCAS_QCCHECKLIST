<?php
$pdo = new PDO('mysql:host=localhost;dbname=station_info', 'root', 'Hbl@1234', [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
]);

echo "=== Debug Section 11 ===\n\n";

// Check station record for ID 106
$query = "SELECT id, station_id, station_name FROM station WHERE id = 106 OR station_id = '106' LIMIT 5";
$stmt = $pdo->prepare($query);
$stmt->execute();
$result = $stmt->fetchAll();
echo "Station records:\n";
print_r($result);

// Check what's in smocip table
$query2 = "SELECT COUNT(*) as count FROM smocip WHERE station_id = 106";
$stmt2 = $pdo->prepare($query2);
$stmt2->execute();
$result2 = $stmt2->fetch();
echo "\nData in smocip table for station_id=106: " . $result2['count'];

echo "\n\nActual data in smocip for station_id=106:\n";
$query4 = "SELECT * FROM smocip WHERE station_id = 106";
$stmt4 = $pdo->prepare($query4);
$stmt4->execute();
$result4 = $stmt4->fetchAll();
print_r($result4);

// Check what's in outdoor_cabling
$query3 = "SELECT COUNT(*) as count FROM outdoor_cabling WHERE station_id = 106";
$stmt3 = $pdo->prepare($query3);
$stmt3->execute();
$result3 = $stmt3->fetch();
echo "\nData in outdoor_cabling table for station_id=106: " . $result3['count'];

echo "\n\nActual data in outdoor_cabling for station_id=106:\n";
$query5 = "SELECT * FROM outdoor_cabling WHERE station_id = 106";
$stmt5 = $pdo->prepare($query5);
$stmt5->execute();
$result5 = $stmt5->fetchAll();
print_r($result5);
?>
