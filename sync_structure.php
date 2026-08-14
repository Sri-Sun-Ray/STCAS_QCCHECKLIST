<?php
// sync_structure.php
error_reporting(E_ALL);
ini_set('display_errors', 0);
header('Content-Type: text/plain');

$conn = mysqli_connect("localhost", "root", "Hbl@1234", "station_info");
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// --- OPTIMIZATION: AUTOMATIC DATABASE INDEXING ---
$tables_to_index = [
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
    "outdoor_cabling",
    "relay_rack",
    "riu",
    "laying_of_sectional_ofc_cable",
    "gps_gsm_antenna",
    "rfid_tags",
    "tag_to_tag_distance"
];

foreach ($tables_to_index as $table) {
    // Check if composite index on (station_id, S_no) already exists
    $check_index = mysqli_query($conn, "
        SELECT COUNT(*) as count 
        FROM INFORMATION_SCHEMA.STATISTICS 
        WHERE TABLE_SCHEMA = 'station_info' 
        AND TABLE_NAME = '$table' 
        AND INDEX_NAME = 'idx_station_sno'
    ");
    if ($check_index) {
        $row = mysqli_fetch_assoc($check_index);
        $has_index = $row ? ($row['count'] > 0) : false;
        
        if (!$has_index) {
            // Create composite index for station_id and S_no
            mysqli_query($conn, "ALTER TABLE `$table` ADD INDEX `idx_station_sno` (`station_id`, `S_no`)");
        }
    }

    // Special: verification_of_equipment_serial_numbers also queries by row_key
    if ($table === 'verification_of_equipment_serial_numbers') {
        $check_rowkey = mysqli_query($conn, "
            SELECT COUNT(*) as count 
            FROM INFORMATION_SCHEMA.STATISTICS 
            WHERE TABLE_SCHEMA = 'station_info' 
            AND TABLE_NAME = '$table' 
            AND INDEX_NAME = 'idx_station_rowkey'
        ");
        if ($check_rowkey) {
            $row = mysqli_fetch_assoc($check_rowkey);
            $has_rowkey = $row ? ($row['count'] > 0) : false;
            if (!$has_rowkey) {
                mysqli_query($conn, "ALTER TABLE `$table` ADD INDEX `idx_station_rowkey` (`station_id`, `row_key`)");
            }
        }
    }
}

// Add composite index on images table
$check_img_index = mysqli_query($conn, "
    SELECT COUNT(*) as count 
    FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE TABLE_SCHEMA = 'station_info' 
    AND TABLE_NAME = 'images' 
    AND INDEX_NAME = 'idx_station_sno_entity'
");
if ($check_img_index) {
    $row = mysqli_fetch_assoc($check_img_index);
    $has_img_index = $row ? ($row['count'] > 0) : false;
    if (!$has_img_index) {
        mysqli_query($conn, "ALTER TABLE `images` ADD INDEX `idx_station_sno_entity` (`station_id`, `s_no`, `entity_type`)");
    }
}

// Add index on report table user_id
$check_report_index = mysqli_query($conn, "
    SELECT COUNT(*) as count 
    FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE TABLE_SCHEMA = 'station_info' 
    AND TABLE_NAME = 'report' 
    AND INDEX_NAME = 'idx_user_id'
");
if ($check_report_index) {
    $row = mysqli_fetch_assoc($check_report_index);
    $has_report_index = $row ? ($row['count'] > 0) : false;
    if (!$has_report_index) {
        mysqli_query($conn, "ALTER TABLE `report` ADD INDEX `idx_user_id` (`user_id`)");
    }
}

$master_rows = [
    "stationary-kavach-unit", "ppc_1", "ppc_2", "vcc_1", "vcc-2", "vcc-3", "vc-1", "vc-2",
    "vgc-1", "vgc-2", "vgc-3", "eig-1", "eig-2", "fiu-1", "fiu-2", "fiu-3", "fiu-4", "fiu-5",
    "fiu-6", "fiu-7", "fiu-8", "riu-comm-1", "riu-comm-2", "rs-232-conv-1", "rs-232-conv-2",
    "rs-485-conv", "fiu-term-1", "fiu-term-2", "fiu-term-3", "fiu-term-4", "fiu-term-5",
    "fiu-term-6", "fiu-term-7", "fiu-term-8", "dps-1", "dps-2", "gps-gsm-1", "gps-gsm-2",
    "smocip", "smocip-term", "station-term-panel", "station-pdu-box", "ips-pdu", "dc-dc-conv",
    "rtu-1", "rtu-2", "station-radio-1", "station-radio-2", "next-gen-radio-1", "next-gen-radio-2",
    "rs-232-conv-rtu-1", "rs-232-conv-rtu-2", "riu", "riu-power-1", "riu-power-2",
    "riu-comm-remote-1", "riu-comm-remote-2", "fiu-scan-1", "fiu-scan-2", "fiu-scan-3",
    "fiu-scan-4", "riu-battery-1", "riu-battery-2", "riu-emi-1", "riu-emi-2", "tcas-emi-1","tcas-emi-2",
    "tcas-cable-extender"
];

$stations = mysqli_query($conn, "SELECT DISTINCT station_id FROM verification_of_equipment_serial_numbers");

if (!$stations) {
    echo "No stations found or query error.";
    exit;
}

while ($station = mysqli_fetch_assoc($stations)) {
    $station_id = $station['station_id'];

    // --- STEP 1.1: AUTO-RESCUE LEGACY CUSTOM ROWS ---
    // If any old custom rows exist with NULL keys, automatically link them by matching their description!
    // We use strict matching (exact or followed by <br>) to prevent prefix collisions like "riuuuu" matching "riuuuuuuuuu_2"
    mysqli_query($conn, "
        UPDATE verification_of_equipment_serial_numbers v
        JOIN row_templates t ON (v.observation_text = t.description OR v.observation_text LIKE CONCAT(t.description, '<br>%')) AND (t.section_id = '2_0' OR t.section_id = '2')
        SET v.row_key = CONCAT('template_row_', t.id)
        WHERE v.station_id='$station_id' AND (v.row_key IS NULL OR v.row_key = '')
    ");

    // --- STEP 1.2: AUTO-RESCUE LEGACY MASTER ROWS BY LEGACY S_NO ---
    // The original database used specific S_no values before any rows were deleted or renamed.
    // By mapping the original S_no to the new row_key, we are 100% immune to text changes, prefix collisions, and shifted numbering!
    $legacy_sno_map = [
        "stationary-kavach-unit" => "1.1", "ppc_1" => "1.2", "ppc_2" => "1.3",
        "vcc_1" => "1.4", "vcc-2" => "1.5", "vcc-3" => "1.6", "vc-1" => "1.7", "vc-2" => "1.8",
        "vgc-1" => "1.9", "vgc-2" => "1.10", "vgc-3" => "1.11", "eig-1" => "1.12", "eig-2" => "1.13",
        "fiu-1" => "1.14", "fiu-2" => "1.15", "fiu-3" => "1.16", "fiu-4" => "1.17", "fiu-5" => "1.18",
        "fiu-6" => "1.19", "fiu-7" => "1.20", "fiu-8" => "1.21", "riu-comm-1" => "1.22",
        "riu-comm-2" => "1.23", "rs-232-conv-1" => "1.24", "rs-232-conv-2" => "1.25",
        "rs-485-conv" => "1.26", "fiu-term-1" => "1.27", "fiu-term-2" => "1.28",
        "fiu-term-3" => "1.29", "fiu-term-4" => "1.30", "fiu-term-5" => "1.31",
        "fiu-term-6" => "1.32", "fiu-term-7" => "1.33", "fiu-term-8" => "1.34",
        "dps-1" => "1.35", "dps-2" => "1.36", "gps-gsm-1" => "1.37", "gps-gsm-2" => "1.38",
        "smocip" => "1.39", "smocip-term" => "1.40", "station-term-panel" => "1.41",
        "station-pdu-box" => "1.42", "ips-pdu" => "1.43", "dc-dc-conv" => "1.44",
        "rtu-1" => "1.45", "rtu-2" => "1.46", "station-radio-1" => "1.47",
        "station-radio-2" => "1.48", "next-gen-radio-1" => "1.49", "next-gen-radio-2" => "1.50",
        "rs-232-conv-rtu-1" => "1.51", "rs-232-conv-rtu-2" => "1.52",
        // Note: Legacy 1.53 was "RS 485-OFC converter (SM-OCIP)" which was removed.
        "riu" => "1.54", "riu-power-1" => "1.55", "riu-power-2" => "1.56",
        "riu-comm-remote-1" => "1.57", "riu-comm-remote-2" => "1.58", "fiu-scan-1" => "1.59",
        "fiu-scan-2" => "1.60", "fiu-scan-3" => "1.61", "fiu-scan-4" => "1.62",
        "riu-battery-1" => "1.63", "riu-battery-2" => "1.64"
    ];

    foreach ($legacy_sno_map as $key => $legacy_sno) {
        mysqli_query($conn, "
            UPDATE verification_of_equipment_serial_numbers 
            SET row_key='$key'
            WHERE station_id='$station_id' 
            AND S_no='$legacy_sno' 
            AND (row_key IS NULL OR row_key = '')
        ");

        mysqli_query($conn, "
            UPDATE images 
            SET row_key='$key'
            WHERE station_id='$station_id'
            AND s_no='$legacy_sno'
            AND entity_type='verification_of_equipment_serial_numbers'
            AND (row_key IS NULL OR row_key = '')
        ");
    }

    foreach ($master_rows as $index => $key) {
        $sno = "1." . ($index + 1);

        $check = mysqli_query($conn, "
            SELECT id FROM verification_of_equipment_serial_numbers 
            WHERE station_id='$station_id' 
            AND row_key='$key'
        ");

        if (mysqli_num_rows($check) == 0) {
            mysqli_query($conn, "
                INSERT INTO verification_of_equipment_serial_numbers 
                (station_id, row_key, S_no, created_at, updated_at)
                VALUES ('$station_id', '$key', '$sno', NOW(), NOW())
            ");
        } else {
            // Update the main table's S_no
            mysqli_query($conn, "
                UPDATE verification_of_equipment_serial_numbers 
                SET S_no='$sno'
                WHERE station_id='$station_id'
                AND row_key='$key'
            ");

            // ALSO update the images table's S_no to keep images tied correctly
            mysqli_query($conn, "
                UPDATE images 
                SET s_no='$sno'
                WHERE station_id='$station_id'
                AND row_key='$key'
                AND entity_type='verification_of_equipment_serial_numbers'
            ");
        }
    }

    $keys = "'" . implode("','", $master_rows) . "'";

    
    // Also rescue any images for these old rows
    mysqli_query($conn, "
        UPDATE images i
        JOIN verification_of_equipment_serial_numbers v ON i.s_no = v.S_no AND i.station_id = v.station_id
        SET i.row_key = v.row_key
        WHERE i.station_id='$station_id' 
        AND i.entity_type='verification_of_equipment_serial_numbers' 
        AND (i.row_key IS NULL OR i.row_key = '')
        AND v.row_key LIKE 'template_row_%'
    ");

    // Delete obsolete rows from main table (Ignore template rows)
    mysqli_query($conn, "
        DELETE FROM verification_of_equipment_serial_numbers 
        WHERE station_id='$station_id'
        AND (row_key NOT IN ($keys) OR row_key IS NULL OR row_key = '')
        AND (row_key NOT LIKE 'template_row_%' OR row_key IS NULL)
    ");

    // Delete obsolete images from the images table (Ignore template rows)
    mysqli_query($conn, "
        DELETE FROM images 
        WHERE station_id='$station_id'
        AND (row_key NOT IN ($keys) OR row_key IS NULL OR row_key = '')
        AND (row_key NOT LIKE 'template_row_%' OR row_key IS NULL)
        AND entity_type='verification_of_equipment_serial_numbers'
    ");
    
    // --- STEP 2: AUTO-ALIGN CUSTOM TEMPLATE ROWS ---
    // Fetch custom rows from row_templates for section 2 (verification_of_equipment_serial_numbers)
    $custom_rows_query = mysqli_query($conn, "SELECT id, s_no FROM row_templates WHERE section_id = '2_0' OR section_id = '2' ORDER BY id ASC");
    $next_sno_index = count($master_rows) + 1; // Start right after the master list
    
    if ($custom_rows_query) {
        while ($template = mysqli_fetch_assoc($custom_rows_query)) {
            $new_sno = "1." . $next_sno_index;
            $template_id = $template['id'];
            $template_row_key = "template_row_" . $template_id;

            // Update row_templates table with new s_no
            mysqli_query($conn, "UPDATE row_templates SET s_no = '$new_sno' WHERE id = $template_id");

            // Update main table
            mysqli_query($conn, "
                UPDATE verification_of_equipment_serial_numbers 
                SET S_no='$new_sno' 
                WHERE station_id='$station_id' AND row_key='$template_row_key'
            ");

            // Update images table
            mysqli_query($conn, "
                UPDATE images 
                SET s_no='$new_sno' 
                WHERE station_id='$station_id' AND row_key='$template_row_key' AND entity_type='verification_of_equipment_serial_numbers'
            ");

            $next_sno_index++;
        }
    }
}

// ==========================================
// UPDATE OBSERVATION TEXT
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
// UPDATE REQUIREMENT TEXT
// ==========================================
$updated_requirements = [
    "4.1.8" => "Functional testing shall be performed as per the PDU test procedure 5 53 20 0024.",
    "9.2.1" => "Check the value of earth resistance at earth of the radio tower. The measured value shall be lessthan or equal to 2 Ohm."
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
// UPDATE STATUS VALUES (Specific Points)
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
// DELETE OBSOLETE POINTS FROM OUTDOOR CABLING
// ==========================================
$deleted_points = ["11.3"];

if (!empty($deleted_points)) {
    $placeholders = implode(',', array_fill(0, count($deleted_points), '?'));
    $types = str_repeat("s", count($deleted_points));
    
    $total_deleted = 0;
    $stations_result = mysqli_query($conn, "SELECT DISTINCT station_id FROM verification_of_equipment_serial_numbers");
    while ($station = mysqli_fetch_assoc($stations_result)) {
        $station_id = $station['station_id'];
        $stmt = $conn->prepare("DELETE FROM outdoor_cabling WHERE station_id = ? AND S_no IN ($placeholders)");
        if ($stmt) {
            $stmt->bind_param("s" . $types, $station_id, ...$deleted_points);
            $stmt->execute();
            $total_deleted += $stmt->affected_rows;
            $stmt->close();
        }
        
        // Also delete associated images
        $stmt = $conn->prepare("DELETE FROM images WHERE station_id = ? AND s_no IN ($placeholders) AND entity_type = 'outdoor_cabling'");
        if ($stmt) {
            $stmt->bind_param("s" . $types, $station_id, ...$deleted_points);
            $stmt->execute();
            $stmt->close();
        }
    }
    echo "Deleted " . $total_deleted . " obsolete observations (11.3) from outdoor_cabling.<br>";
}

// ==========================================
// ENSURE POINT 12.4 EXISTS FOR ALL STATIONS
// ==========================================
$rfid_text = "Verify replacement of RFID Point Tags with the new FRP Tag Mounting Base";
$rfid_req = "All RFID Point Tags are installed using the FRP Tag Mounting Base.";

$stations_result = mysqli_query($conn, "SELECT DISTINCT station_id FROM verification_of_equipment_serial_numbers");
$added_12_4 = 0;
if ($stations_result) {
    while ($station = mysqli_fetch_assoc($stations_result)) {
        $st_id = $station['station_id'];
        $check_12_4 = mysqli_query($conn, "SELECT id FROM rfid_tags WHERE station_id = '$st_id' AND S_no = '12.4'");
        if ($check_12_4 && mysqli_num_rows($check_12_4) == 0) {
            $stmt_ins = $conn->prepare("INSERT INTO rfid_tags (station_id, S_no, observation_text, requirement_text, observation_status, created_at, updated_at) VALUES (?, '12.4', ?, ?, 'Select', NOW(), NOW())");
            if ($stmt_ins) {
                $stmt_ins->bind_param("sss", $st_id, $rfid_text, $rfid_req);
                $stmt_ins->execute();
                $added_12_4 += $stmt_ins->affected_rows;
                $stmt_ins->close();
            }
        }
    }
}
echo "Added missing point 12.4 to " . $added_12_4 . " stations in rfid_tags.<br>";

echo "<br>Sync complete";
mysqli_close($conn);
?>
