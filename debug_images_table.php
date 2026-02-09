<?php
$pdo = new PDO('mysql:host=localhost;dbname=station_info', 'root', 'Hbl@1234', [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
]);

echo "=== Check images table schema ===\n";
$query = "DESC images";
$stmt = $pdo->prepare($query);
$stmt->execute();
$result = $stmt->fetchAll();
print_r($result);

echo "\n\n=== Sample images records ===\n";
$query = "SELECT * FROM images LIMIT 5";
$stmt = $pdo->prepare($query);
$stmt->execute();
$result = $stmt->fetchAll();
print_r($result);
?>
