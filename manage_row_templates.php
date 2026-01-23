<?php
header('Content-Type: application/json');
$conn = new mysqli("localhost", "root", "Hbl@1234", "station_info");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

// Create table if not exists (One-time setup effectively)
$table_sql = "CREATE TABLE IF NOT EXISTS row_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_id VARCHAR(50) NOT NULL,
    s_no VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";
$conn->query($table_sql);

$action = $_POST['action'] ?? '';

if ($action === 'fetch') {
    $section_id = $_POST['section_id'] ?? '';
    // Sort by s_no to maintain order. We assume s_no format is like "X.Y" and we want to sort roughly numerically if possible, 
    // but string sort is usually okay for "1.26", "1.27" etc.
    // However, string sort "1.10" comes before "1.2". So we might need natural sort if possible, or just strict addition order (ID).
    // Let's sort by ID to ensure they appear in order of creation, which matches "statically added later".
    $sql = "SELECT * FROM row_templates WHERE section_id = ? ORDER BY id ASC";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $section_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $rows = [];
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
    echo json_encode(["success" => true, "data" => $rows]);
} 
elseif ($action === 'add') {
    $section_id = $_POST['section_id'] ?? '';
    $s_no = $_POST['s_no'] ?? '';
    $description = $_POST['description'] ?? '';

    if (!$section_id || !$s_no || !$description) {
        echo json_encode(["success" => false, "message" => "Missing required fields"]);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO row_templates (section_id, s_no, description) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $section_id, $s_no, $description);
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "id" => $stmt->insert_id]);
    } else {
        echo json_encode(["success" => false, "message" => $stmt->error]);
    }
} 
elseif ($action === 'delete') {
    $s_no = $_POST['s_no'] ?? '';
    $section_id = $_POST['section_id'] ?? '';

    if (!$s_no || !$section_id) {
         echo json_encode(["success" => false, "message" => "Missing s_no or section_id"]);
         exit;
    }

    $table_mapping = [
        2 => "verification_of_equipment_serial_numbers",
        3 => "tower",
        4 => "rtu",
        5 => "rf_antennas",
        6 => "installation_of_kavach_equipment",
        7 => "networking_rack",
        8 => "ips",
        9 => "dc_convertor",
        10 => "pdu",
        11 => "smocip",
        12 => "gps_gsm_antenna",
        13 => "relay_rack",
        14 => "riu",
        15 => "laying_of_sectional_ofc_cable",
        16 => "outdoor_cabling",
        17 => "rfid_tags",
        18 => "tag_to_tag_distance",
    ];

    $int_section_id = intval($section_id);
    if(isset($table_mapping[$int_section_id])) {
        $table_name = $table_mapping[$int_section_id];
        // Delete observations associated with this s_no for ALL stations
        // Since the template is being deleted permanently
        $stmt_obs = $conn->prepare("DELETE FROM $table_name WHERE s_no = ?");
        $stmt_obs->bind_param("s", $s_no);
        $stmt_obs->execute();
        $stmt_obs->close();
    }

    $stmt = $conn->prepare("DELETE FROM row_templates WHERE s_no = ? AND section_id = ?");
    $stmt->bind_param("ss", $s_no, $section_id);
    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => $stmt->error]);
    }
} 
else {
    echo json_encode(["success" => false, "message" => "Invalid action"]);
}

$conn->close();
?>
