<?php
session_start();

header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "Hbl@1234";
$dbname = "station_info";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(['status' => 'error', 'message' => 'DB connection failed: ' . $conn->connect_error]);
    exit;
}

if (!isset($_GET['station_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Missing station_id']);
    exit;
}

$stationId = $conn->real_escape_string($_GET['station_id']);

$tableNames = [
    "verification_of_equipment_serial_numbers","tower", "rtu","rf_antennas","installation_of_kavach_equipment",
    "networking_rack", "ips", "dc_convertor", "pdu","smocip","outdoor_cabling","relay_rack","riu","laying_of_sectional_ofc_cable","gps_gsm_antenna","rfid_tags","tag_to_tag_distance",
];

$observations = [];

foreach ($tableNames as $tableName) {
    if ($tableName === "verification_of_equipment_serial_numbers") {
        $sql = "SELECT S_no, observation_text, requirement_text, observation_status, remarks, created_at, updated_at, barcode_kavach_main_unit FROM $tableName WHERE station_id = ?";
    } else {
        $sql = "SELECT S_no, observation_text, requirement_text, observation_status, remarks, created_at, updated_at FROM $tableName WHERE station_id = ?";
    }

    // ATTEMPT 1: Try fetching with timestamps
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        // If prepare failed (likely due to missing columns), try fallback immediately
        error_log("Prepare failed for table $tableName (Attempt 1): " . $conn->error . ". Trying fallback...");

        // ATTEMPT 2: Fallback without timestamps
        if ($tableName === "verification_of_equipment_serial_numbers") {
            $sql = "SELECT S_no, observation_text, requirement_text, observation_status, remarks, NULL as created_at, NULL as updated_at, barcode_kavach_main_unit FROM $tableName WHERE station_id = ?";
        } else {
            $sql = "SELECT S_no, observation_text, requirement_text, observation_status, remarks, NULL as created_at, NULL as updated_at FROM $tableName WHERE station_id = ?";
        }

        $stmt = $conn->prepare($sql);
        if (!$stmt) {
             error_log("Prepare failed for table $tableName (Attempt 2 - Fallback): " . $conn->error);
             continue; // Skip this table if both attempts fail
        }
    }

    $stmt->bind_param("s", $stationId);

    if (!$stmt->execute()) {
        error_log("Execute failed for table $tableName: " . $stmt->error);
        continue;
    }

    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc()) {
        $s_no = $row['S_no'];

        // Fetch associated images from `images` table for each S_no
        $imgStmt = $conn->prepare("SELECT image_path FROM images WHERE station_id = ? AND s_no = ? AND entity_type = ?");
        $imgStmt->bind_param("sss", $stationId, $s_no, $tableName);
        $imgStmt->execute();
        $imgResult = $imgStmt->get_result();

        $imagePaths = [];
        while ($imgRow = $imgResult->fetch_assoc()) {
            $imagePaths[] = $imgRow['image_path'];
        }

       $observations[] = [
            'S_no' => $row['S_no'],
            'observation_text' => $row['observation_text'],
            'requirement_text' => $row['requirement_text'],
            'observation_status' => $row['observation_status'],
            'remarks' => $row['remarks'],
            'image_paths' => $imagePaths,
            'barcode_kavach_main_unit' => isset($row['barcode_kavach_main_unit']) ? $row['barcode_kavach_main_unit'] : null,
            'created_at' => $row['created_at'],
            'updated_at' => $row['updated_at']
        ];
    }
}

// Special check for 13.1 (Section 14.0) if not already found
$found13_1 = false;
foreach ($observations as $obs) {
    if ($obs['S_no'] == '13.1') {
        $found13_1 = true;
        break;
    }
}

if (!$found13_1) {
    // Try finding it in rfid_tags or relay_rack
    $fallbackTables = ['rfid_tags', 'relay_rack'];
    foreach ($fallbackTables as $fbTable) {
        $sql = "SELECT S_no, observation_text, requirement_text, observation_status, remarks, NULL as created_at, NULL as updated_at FROM $fbTable WHERE station_id = ? AND S_no = '13.1'";

        if ($stmt = $conn->prepare($sql)) {
            $stmt->bind_param("s", $stationId);
            if ($stmt->execute()) {
                $result = $stmt->get_result();
                while ($row = $result->fetch_assoc()) {
                    // Fetch images
                    $imgStmt = $conn->prepare("SELECT image_path FROM images WHERE station_id = ? AND s_no = ? AND entity_type = ?");
                    $imgStmt->bind_param("sss", $stationId, $row['S_no'], $fbTable);
                    $imgStmt->execute();
                    $imgResult = $imgStmt->get_result();
                    $imagePaths = [];
                    while ($imgRow = $imgResult->fetch_assoc()) {
                        $imagePaths[] = $imgRow['image_path'];
                    }

                    $observations[] = [
                        'S_no' => $row['S_no'],
                        'observation_text' => $row['observation_text'],
                        'requirement_text' => $row['requirement_text'],
                        'observation_status' => $row['observation_status'],
                        'remarks' => $row['remarks'],
                        'image_paths' => $imagePaths,
                        'barcode_kavach_main_unit' => null,
                        'created_at' => null,
                        'updated_at' => null
                    ];
                    $found13_1 = true;
                }
            }
        }
        if ($found13_1) break;
    }
}

// Count custom rows from row_templates
$customCountResult = $conn->query("SELECT COUNT(*) as cnt FROM row_templates");
$customCount = 0;
if ($customCountResult) {
    $row = $customCountResult->fetch_assoc();
    $customCount = (int)$row['cnt'];
}

if (!empty($observations)) {
    echo json_encode(['status' => 'success', 'data' => $observations, 'total_custom_points' => $customCount]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'No observations found', 'total_custom_points' => $customCount]);
}

$conn->close();
?>
