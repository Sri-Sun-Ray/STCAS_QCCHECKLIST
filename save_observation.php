<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
header('Content-Type: application/json');

// DB Connection
$conn = new mysqli("localhost", "root", "Hbl@1234", "station_info");
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

// Validate input
$required = ['S_no', 'observation_text', 'observation_status', 'remarks', 'section-id', 'station-id'];
foreach ($required as $field) {
    if (empty($_POST[$field]) && $_POST[$field] !== "0") {
        echo json_encode(["success" => false, "message" => "Missing: $field"]);
        exit;
    }
}

$S_no = $_POST['S_no']; // Changed to string as S_no handles 1.1 etc now
$observation_text = $_POST['observation_text'];
$requirement_text = isset($_POST['requirement_text']) ? $_POST['requirement_text'] : null;
$observation_status = $_POST['observation_status'];
$remarks = $_POST['remarks'];
$section_id = intval($_POST['section-id']);
$station_id = intval($_POST['station-id']);

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

if (!isset($table_mapping[$section_id])) {
    echo json_encode(["success" => false, "message" => "Invalid section ID"]);
    exit;
}

$table_name = $table_mapping[$section_id];
$image_path = null;

// Handle file upload
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $upload_dir = "uploads/";
    if (!is_dir($upload_dir)) mkdir($upload_dir, 0777, true);

    $filename = time() . "_" . basename($_FILES['image']['name']);
    $target = $upload_dir . $filename;

    if (!move_uploaded_file($_FILES['image']['tmp_name'], $target)) {
        echo json_encode(["success" => false, "message" => "Image upload failed"]);
        exit;
    }
    $image_path = $target;
}

// Check if record exists
$sql_check = "SELECT COUNT(*) AS cnt FROM $table_name WHERE S_no = ? AND station_id = ?";
$stmt_check = $conn->prepare($sql_check);
$stmt_check->bind_param("si", $S_no, $station_id); // S_no is string now
$stmt_check->execute();
$result = $stmt_check->get_result()->fetch_assoc();
$stmt_check->close();

$exists = $result['cnt'] > 0;

$barcode = isset($_POST['barcode_kavach_main_unit']) ? $_POST['barcode_kavach_main_unit'] : null;
$is_barcode_table = ($table_name === "verification_of_equipment_serial_numbers");

if ($exists) {
    // UPDATE
    if ($is_barcode_table) {
        $sql = "UPDATE $table_name SET observation_text = ?, requirement_text = ?, observation_status = ?, remarks = ?, barcode_kavach_main_unit = ?";
    } else {
        $sql = "UPDATE $table_name SET observation_text = ?, requirement_text = ?, observation_status = ?, remarks = ?";
    }
    
    if ($image_path !== null) $sql .= ", image_path = ?";
    $sql .= " WHERE S_no = ? AND station_id = ?";

    $stmt = $conn->prepare($sql);
    
    if ($is_barcode_table) {
        if ($image_path !== null) {
            $stmt->bind_param("sssssssi", $observation_text, $requirement_text, $observation_status, $remarks, $barcode, $image_path, $S_no, $station_id);
        } else {
            $stmt->bind_param("ssssssi", $observation_text, $requirement_text, $observation_status, $remarks, $barcode, $S_no, $station_id);
        }
    } else {
        if ($image_path !== null) {
            $stmt->bind_param("ssssssi", $observation_text, $requirement_text, $observation_status, $remarks, $image_path, $S_no, $station_id);
        } else {
            $stmt->bind_param("sssssi", $observation_text, $requirement_text, $observation_status, $remarks, $S_no, $station_id);
        }
    }
} else {
    // INSERT
    if ($is_barcode_table) {
        $sql = "INSERT INTO $table_name (S_no, station_id, observation_text, requirement_text, observation_status, remarks, image_path, barcode_kavach_main_unit)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sissssss", $S_no, $station_id, $observation_text, $requirement_text, $observation_status, $remarks, $image_path, $barcode);
    } else {
        $sql = "INSERT INTO $table_name (S_no, station_id, observation_text, requirement_text, observation_status, remarks, image_path)
                VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sisssss", $S_no, $station_id, $observation_text, $requirement_text, $observation_status, $remarks, $image_path);
    }
}

if ($stmt->execute()) {
    // Update the station table's update date
    $sql_upd = "UPDATE station SET updated_date = NOW() WHERE station_id = ?";
    $stmt_upd = $conn->prepare($sql_upd);
    $stmt_upd->bind_param("i", $station_id);
    $stmt_upd->execute();
    $stmt_upd->close();

    echo json_encode(["success" => true, "message" => $exists ? "Updated" : "Inserted"]);
} else {
    echo json_encode(["success" => false, "message" => "DB Error: " . $stmt->error]);
}
$stmt->close();
$conn->close();
?>
