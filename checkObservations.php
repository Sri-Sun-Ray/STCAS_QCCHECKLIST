<?php
header("Content-Type: application/json");

// Enable error reporting for debugging
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Database connection details
$servername = "localhost";
$username = "root";
$password = "Hbl@1234";
$dbname = "station_info";

// Create database connection
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit;
}

// Get JSON input
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["stationId"], $data["zone"], $data["division"], $data["sectionId"])) {
    echo json_encode([
        "error" => "Missing required parameters",
        "received" => $data
    ]);
    exit;
}

$stationId = $data["stationId"];
$zone = $data["zone"];
$division = $data["division"];
$sectionId = (int) $data["sectionId"];
$subsection = isset($data["subsection"]) ? $data["subsection"] : null;

// Define table names
$tableNames = [
    0 => 'station',
    2 => 'verification_of_equipment_serial_numbers',
    3 => 'tower',
    4 => 'rtu',
    5 => 'rf_antennas',
    6 => 'installation_of_kavach_equipment',
    7 => 'networking_rack',
    8 => 'ips',
    9 => 'dc_convertor',
    10 => 'pdu',
    11 => 'smocip',
    12 => 'outdoor_cabling',
    13 => 'relay_rack',
    14 => 'riu',
    15 => 'laying_of_sectional_ofc_cable',
    16 => 'outdoor_cabling',
    17 => 'rfid_tags',
    18 => 'tag_to_tag_distance'
];

if (!isset($tableNames[$sectionId])) {
    echo json_encode(["error" => "Invalid section ID"]);
    exit;
}

$table = $tableNames[$sectionId];

if ($sectionId == 0) {
    $checkQuery = "SELECT COUNT(*) as count FROM station WHERE station_id = ? AND railway_zone = ? AND division = ?";
    $checkStmt = $conn->prepare($checkQuery);
    $checkStmt->bind_param("sss", $stationId, $zone, $division);
} else {
    if ($subsection) {
        $checkQuery = "SELECT COUNT(*) as count FROM $table WHERE station_id = ? AND s_no LIKE ?";
        $checkStmt = $conn->prepare($checkQuery);
        $likePattern = $subsection . "%";
        $checkStmt->bind_param("ss", $stationId, $likePattern);
    } else {
        $checkQuery = "SELECT COUNT(*) as count FROM $table WHERE station_id = ?";
        $checkStmt = $conn->prepare($checkQuery);
        $checkStmt->bind_param("s", $stationId);
    }
}
$checkStmt->execute();

$row = $checkStmt->get_result()->fetch_assoc();
$exists = $row["count"] > 0;

echo json_encode([
    "exists" => $exists,
    "sectionId" => $sectionId,
    "subsection" => $subsection,
    "message" => $exists ? "Section/Subsection is filled" : "Section/Subsection is empty"
]);

$conn->close();
?>
