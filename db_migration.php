<?php
// Database Update Script for Checklist Modifications

$conn = new mysqli("localhost", "root", "Hbl@1234", "station_info");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$tables = [
    "verification_of_equipment_serial_numbers",
    "tower",
    "rtu",
    "rf_antennas",
    "installation_of_kavach_equipment",
    "networking_rack",
    "ips",
    "dc_convertor",
    "pdu",
    "smocip",
    "gps_gsm_antenna",
    "relay_rack",
    "riu",
    "laying_of_sectional_ofc_cable",
    "outdoor_cabling",
    "rfid_tags",
    "tag_to_tag_distance"
];

// ==========================================
// 1. DELETE POINTS
// ==========================================
$deleted_points = [""];

if (!empty($deleted_points)) {
    $placeholders = implode(',', array_fill(0, count($deleted_points), '?'));
    $types = str_repeat("s", count($deleted_points));
    
    $total_deleted = 0;
    foreach ($tables as $table) {
        $stmt = $conn->prepare("DELETE FROM $table WHERE S_no IN ($placeholders)");
        if ($stmt) {
            $stmt->bind_param($types, ...$deleted_points);
            $stmt->execute();
            $total_deleted += $stmt->affected_rows;
            $stmt->close();
        }
    }
    echo "Deleted " . $total_deleted . " obsolete observations.<br>";
}

// ==========================================
// 2. RENAME / UPDATE TEXT
// ==========================================
$renamed_points = [
    "1.39" => "SMOCIP Unit",
    "1.20" => "Field Scanner Card 7"
];

$total_updated = 0;
foreach ($renamed_points as $s_no => $new_text) {
    foreach ($tables as $table) {
        $stmt = $conn->prepare("UPDATE $table SET observation_text = ? WHERE S_no = ?");
        if ($stmt) {
            $stmt->bind_param("ss", $new_text, $s_no);
            $stmt->execute();
            $total_updated += $stmt->affected_rows;
            $stmt->close();
        }
    }
}
echo "Updated text for " . $total_updated . " observations.<br>";

// ==========================================
// 3. UPDATE REQUIREMENT TEXT
// ==========================================
$updated_requirements = [
    "4.1.8" => "Functional testing shall be performed as per the PDU test procedure 5 53 20 0023."
];

$total_req_updated = 0;
foreach ($updated_requirements as $s_no => $new_req) {
    foreach ($tables as $table) {
        $stmt = $conn->prepare("UPDATE $table SET requirement_text = ? WHERE S_no = ?");
        if ($stmt) {
            $stmt->bind_param("ss", $new_req, $s_no);
            $stmt->execute();
            $total_req_updated += $stmt->affected_rows;
            $stmt->close();
        }
    }
}
echo "Updated requirement text for " . $total_req_updated . " observations.<br>";

$conn->close();
echo "<br><b>Database Migration Completed Successfully!</b><br>";
echo "You can view your old reports now, and they will reflect the new template.";
?>
