<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
header('Content-Type: application/json');

$tableNames = [
    "verification_of_equipment_serial_numbers","tower", "rtu","rf_antennas","installation_of_kavach_equipment",
    "networking_rack", "ips", "dc_convertor", "pdu","smocip","outdoor_cabling","relay_rack","riu","laying_of_sectional_ofc_cable","gps_gsm_antenna","rfid_tags","tag_to_tag_distance",

];

$sectionIndex = $_POST['section_index'] ?? null;
if (!isset($tableNames[(int)$sectionIndex])) {
    echo json_encode(['success' => false, 'message' => 'Invalid or missing section index.']);
    exit;
}
$tableName = $tableNames[(int)$sectionIndex];

$stationId = $_POST['station-id'] ?? '';
$sectionId = $_POST['section-id'] ?? '';
$observationsJson = $_POST['observations'] ?? '';

if (empty($stationId) || empty($sectionId) || empty($observationsJson)) {
    echo json_encode(['success' => false, 'message' => 'Missing required data.']);
    exit;
}

$observations = json_decode($observationsJson, true);
if (!$observations || !is_array($observations)) {
    echo json_encode(['success' => false, 'message' => 'Invalid observations format.']);
    exit;
}

try {
    $pdo = new PDO("mysql:host=localhost;dbname=station_info;charset=utf8mb4", "root", "Hbl@1234", [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'DB connection failed: ' . $e->getMessage()]);
    exit;
}

$debugInfo = [];
try {
    $pdo->beginTransaction();

    $logData = "Received Request:\n" . print_r($observations, true) . "\n-----------------\n";
    file_put_contents('debug_observations.log', $logData, FILE_APPEND);

    foreach ($observations as $obs) {
        $s_no = trim($obs['S_no']);
        
        $remarks = $obs['remarks'] ?? '';
        $status = $obs['observation_status'] ?? '';
        $requirement_text = $obs['requirement_text'] ?? '';
        $observation_text = $obs['observation_text'] ?? '';
        $barcode = trim($obs['barcode_kavach_main_unit'] ?? '');
        $image_paths = $obs['image_paths'] ?? [];

        // Check if record exists (Using S_no to match schema)
        $check = $pdo->prepare("SELECT id FROM $tableName WHERE station_id = ? AND S_no = ?");
        $check->execute([$stationId, $s_no]);
        $existing = $check->fetch();
        
        $rowLog = "Processing S_no: $s_no. Status: $status, Remarks: $remarks. Existing: " . ($existing ? 'Yes' : 'No') . "\n";
        file_put_contents('debug_observations.log', $rowLog, FILE_APPEND);

        if ($existing) {
            // Prepare UPDATE query
            $sql = "UPDATE $tableName SET observation_status = ?, remarks = ?, updated_at = NOW()";
            $params = [$status, $remarks];
            
            if ($tableName === 'verification_of_equipment_serial_numbers') {
                $sql .= ", barcode_kavach_main_unit = ?";
                $params[] = $barcode;
            }
            
            $sql .= " WHERE station_id = ? AND S_no = ?";
            $params[] = $stationId;
            $params[] = $s_no;
            
            $update = $pdo->prepare($sql);
            $update->execute($params);
            $count = $update->rowCount();
            $logMsg = "Update executed for S_no $s_no. Rows affected: $count\nSQL: $sql\nParams: " . json_encode($params) . "\n";
            file_put_contents('debug_observations.log', $logMsg, FILE_APPEND);
        } else {
            // INSERT new record
            $sql = "INSERT INTO $tableName (station_id, S_no, observation_text, requirement_text, observation_status, remarks, created_at, updated_at";
            $placeholders = "?, ?, ?, ?, ?, ?, NOW(), NOW()";
            $params = [$stationId, $s_no, $observation_text, $requirement_text, $status, $remarks];
            
            if ($tableName === 'verification_of_equipment_serial_numbers') {
                $sql .= ", barcode_kavach_main_unit";
                $placeholders .= ", ?";
                $params[] = $barcode;
            }
            
            $sql .= ") VALUES ($placeholders)";
            $insert = $pdo->prepare($sql);
            $insert->execute($params);
            file_put_contents('debug_observations.log', "Insert executed for S_no $s_no\n", FILE_APPEND);
        }

        // Handle images
        $deleteStmt = $pdo->prepare("DELETE FROM images WHERE station_id = ? AND s_no = ? AND entity_type = ?");
        $deleteStmt->execute([$stationId, $s_no, $tableName]);

        if (!empty($image_paths)) {
            foreach ($image_paths as $imgPath) {
                $imgStmt = $pdo->prepare("INSERT INTO images (entity_type, station_id, s_no, image_path, created_at) VALUES (?, ?, ?, ?, NOW())");
                $imgStmt->execute([$tableName, $stationId, $s_no, $imgPath]);
            }
        }
        
        $debugInfo[] = ['S_no' => $s_no, 'action' => $existing ? 'updated' : 'inserted'];
    }

    // Update the station table's update date
    $updateStation = $pdo->prepare("UPDATE station SET updated_date = NOW() WHERE station_id = ?");
    $updateStation->execute([$stationId]);

    $pdo->commit();
    echo json_encode(['success' => true, 'message' => 'Observations and station info updated successfully.', 'debug' => $debugInfo]);
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo json_encode(['success' => false, 'message' => 'Error updating observations: ' . $e->getMessage()]);
}
?>
