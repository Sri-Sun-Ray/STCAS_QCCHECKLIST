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
$deleted_points = ["11.3", "1.53"];

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
// 2. RENAME / UPDATE OBSERVATION TEXT
// ==========================================
$renamed_points = [
    "1.39" => "SMOCIP Unit",
    "1.14" => "FIU Scanner Card 1",
    "1.15" => "FIU Scanner Card 2",
    "1.16" => "FIU Scanner Card 3",
    "1.17" => "FIU Scanner Card 4",
    "1.18" => "FIU Scanner Card 5",
    "1.19" => "FIU Scanner Card 6",
    "1.20" => "FIU Scanner Card 7",
    "1.21" => "FIU Scanner Card 8",
    "1.58" => "FIU Scanner Card 1",
    "1.59" => "FIU Scanner Card 2",
    "1.60" => "FIU Scanner Card 3",
    "1.61" => "FIU Scanner Card 4"
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
echo "Updated observation text for " . $total_updated . " observations.<br>";

// ==========================================
// 3. UPDATE REQUIREMENT TEXT
// ==========================================
$updated_requirements = [
    "4.1.8" => "Functional testing shall be performed as per the PDU test procedure 5 53 20 0024."
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

// ==========================================
// 4. UPDATE STATUS VALUES (Specific Points)
// ==========================================
$status_updates_by_sno = [
    "1.44" => [
        "Matching" => "Verified",
        "Not Matching" => "Not Verified"
    ]
];

$total_status_updated = 0;
foreach ($status_updates_by_sno as $s_no => $updates) {
    foreach ($updates as $old_status => $new_status) {
        foreach ($tables as $table) {
            $stmt = $conn->prepare("UPDATE $table SET observation_status = ? WHERE observation_status = ? AND S_no = ?");
            if ($stmt) {
                $stmt->bind_param("sss", $new_status, $old_status, $s_no);
                $stmt->execute();
                $total_status_updated += $stmt->affected_rows;
                $stmt->close();
            }
        }
    }
}
echo "Updated status values for $total_status_updated observations (filtered by S_no).<br>";

// ==========================================
// 5. RENAME S_NO (MOVE 1.54 TO 1.53)
// ==========================================
$total_moved = 0;
foreach ($tables as $table) {
    $stmt = $conn->prepare("UPDATE $table SET S_no = '1.53' WHERE S_no = '1.54'");
    if ($stmt) {
        $stmt->execute();
        $total_moved += $stmt->affected_rows;
        $stmt->close();
    }
}
echo "Moved 1.54 to 1.53 in $total_moved rows.<br>";

// ==========================================
// 7. AUTO-ALIGN CUSTOM ROWS (SECTION 2.0)
// ==========================================
// This section ensures custom rows ALWAYS start immediately after standard rows.
// If you add standard rows, custom rows shift forward.
// If you delete standard rows, custom rows move back to fill the gap.
$STANDARD_LIMIT = 68; // Update this whenever you add/remove rows in script.js
$SECTION_ID = "2_0";

$all_custom = $conn->query("SELECT id, s_no FROM row_templates WHERE section_id = '$SECTION_ID' AND s_no LIKE '1.%' ORDER BY id ASC");
$next_available_index = $STANDARD_LIMIT + 1;
$changed_count = 0;

while ($c_row = $all_custom->fetch_assoc()) {
    $old_sno = $c_row['s_no'];
    $new_sno = "1." . $next_available_index;

    if ($old_sno !== $new_sno) {
        $id = $c_row['id'];
        // Update Template
        $conn->query("UPDATE row_templates SET s_no = '$new_sno' WHERE id = $id");
        // Update Observations
        $conn->query("UPDATE verification_of_equipment_serial_numbers SET S_no = '$new_sno' WHERE S_no = '$old_sno'");
        // Update Images
        $conn->query("UPDATE images SET s_no = '$new_sno' WHERE s_no = '$old_sno'");
        $changed_count++;
    }
    $next_available_index++;
}

if ($changed_count > 0) {
    echo "Automatically re-aligned $changed_count custom rows to follow standard points (1.1 - 1.$STANDARD_LIMIT).<br>";
}

$conn->close();
echo "<br><b>Database Migration Completed Successfully!</b><br>";
echo "You can view your old reports now, and they will reflect the new template.";
?>
