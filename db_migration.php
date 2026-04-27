<?php
// Database Update Script for Checklist Modifications

$conn = new mysqli("localhost", "root", "Hbl@1234", "station_info");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$conn->set_charset("utf8mb4");

// ==========================================
// CONFIG
// ==========================================

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

// Section where add-row custom points are stored
$SECTION_ID = "2_0";

// Current static/default row count in script.js
// Example: static rows are 1.1 to 1.68, so value is 68
$STATIC_ROWS_COUNT = 68;


// ==========================================
// 1. DELETE REMOVED STATIC POINTS
// ==========================================

$deleted_points = [
    // "1.53",
    // "11.3"
];

if (!empty($deleted_points)) {
    $placeholders = implode(",", array_fill(0, count($deleted_points), "?"));
    $types = str_repeat("s", count($deleted_points));

    $total_deleted = 0;

    foreach ($tables as $table) {
        $stmt = $conn->prepare("DELETE FROM `$table` WHERE S_no IN ($placeholders)");

        if ($stmt) {
            $stmt->bind_param($types, ...$deleted_points);
            $stmt->execute();
            $total_deleted += $stmt->affected_rows;
            $stmt->close();
        }
    }

    echo "Deleted $total_deleted removed static points.<br>";
}


// ==========================================
// 2. UPDATE / RENAME STATIC OBSERVATION TEXT
// ==========================================

$renamed_points = [
    // "1.39" => "SMOCIP Unit",
    // "1.14" => "FIU Scanner Card 1",
];

$total_updated = 0;

foreach ($renamed_points as $s_no => $new_text) {
    foreach ($tables as $table) {
        $stmt = $conn->prepare("
            UPDATE `$table`
            SET observation_text = ?
            WHERE S_no = ?
        ");

        if ($stmt) {
            $stmt->bind_param("ss", $new_text, $s_no);
            $stmt->execute();
            $total_updated += $stmt->affected_rows;
            $stmt->close();
        }
    }
}

echo "Updated observation text: $total_updated rows.<br>";


// ==========================================
// 3. UPDATE REQUIREMENT TEXT
// ==========================================

$updated_requirements = [
    // "4.1.8" => "Functional testing shall be performed as per the PDU test procedure 5 53 20 0024."
];

$total_req_updated = 0;

foreach ($updated_requirements as $s_no => $new_req) {
    foreach ($tables as $table) {
        $stmt = $conn->prepare("
            UPDATE `$table`
            SET requirement_text = ?
            WHERE S_no = ?
        ");

        if ($stmt) {
            $stmt->bind_param("ss", $new_req, $s_no);
            $stmt->execute();
            $total_req_updated += $stmt->affected_rows;
            $stmt->close();
        }
    }
}

echo "Updated requirement text: $total_req_updated rows.<br>";


// ==========================================
// 4. UPDATE STATUS VALUES
// ==========================================

$status_updates_by_sno = [
    // "1.44" => [
    //     "Matching" => "Verified",
    //     "Not Matching" => "Not Verified"
    // ]
];

$total_status_updated = 0;

foreach ($status_updates_by_sno as $s_no => $updates) {
    foreach ($updates as $old_status => $new_status) {
        foreach ($tables as $table) {
            $stmt = $conn->prepare("
                UPDATE `$table`
                SET observation_status = ?
                WHERE observation_status = ?
                  AND S_no = ?
            ");

            if ($stmt) {
                $stmt->bind_param("sss", $new_status, $old_status, $s_no);
                $stmt->execute();
                $total_status_updated += $stmt->affected_rows;
                $stmt->close();
            }
        }
    }
}

echo "Updated status values: $total_status_updated rows.<br>";


// ==========================================
// 5. MOVE / RENAME STATIC S_NO
// ==========================================

$moved_sno_points = [
    // "1.54" => "1.53"
];

$total_moved = 0;

foreach ($moved_sno_points as $old_sno => $new_sno) {
    foreach ($tables as $table) {
        $stmt = $conn->prepare("
            UPDATE `$table`
            SET S_no = ?
            WHERE S_no = ?
        ");

        if ($stmt) {
            $stmt->bind_param("ss", $new_sno, $old_sno);
            $stmt->execute();
            $total_moved += $stmt->affected_rows;
            $stmt->close();
        }
    }

    $stmtImg = $conn->prepare("
        UPDATE images
        SET s_no = ?
        WHERE s_no = ?
    ");

    if ($stmtImg) {
        $stmtImg->bind_param("ss", $new_sno, $old_sno);
        $stmtImg->execute();
        $stmtImg->close();
    }
}

echo "Moved static S_no rows: $total_moved rows.<br>";


// ==========================================
// 6. AUTO ALIGN CUSTOM ROWS AFTER STATIC ROWS
// ==========================================
// Purpose:
// If old static rows were 1.1 to 1.64
// and user added custom rows 1.65, 1.66, 1.67, 1.68
//
// Then later static rows become 1.1 to 1.67,
// custom rows should automatically become:
// 1.68, 1.69, 1.70, 1.71

$custom_rows = $conn->query("
    SELECT id, s_no, description
    FROM row_templates
    WHERE section_id = '$SECTION_ID'
      AND s_no LIKE '1.%'
      AND CAST(SUBSTRING_INDEX(s_no, '.', -1) AS UNSIGNED) > $STATIC_ROWS_COUNT
    ORDER BY id ASC
");

$next_sno_number = $STATIC_ROWS_COUNT + 1;
$custom_updated_count = 0;

if ($custom_rows) {
    while ($row = $custom_rows->fetch_assoc()) {
        $template_id = (int)$row["id"];
        $old_sno = trim($row["s_no"]);
        $new_sno = "1." . $next_sno_number;
        $description = trim($row["description"]);

        if ($old_sno !== $new_sno) {

            // Update template table
            $stmt1 = $conn->prepare("
                UPDATE row_templates
                SET s_no = ?
                WHERE id = ?
            ");

            if ($stmt1) {
                $stmt1->bind_param("si", $new_sno, $template_id);
                $stmt1->execute();
                $stmt1->close();
            }

            // Update existing saved rows safely using old s_no + description
            $stmt2 = $conn->prepare("
                UPDATE verification_of_equipment_serial_numbers
                SET S_no = ?
                WHERE S_no = ?
                  AND LOWER(TRIM(observation_text)) LIKE CONCAT(LOWER(TRIM(?)), '%')
            ");

            if ($stmt2) {
                $stmt2->bind_param("sss", $new_sno, $old_sno, $description);
                $stmt2->execute();
                $stmt2->close();
            }

            // Update image mapping
            $stmt3 = $conn->prepare("
                UPDATE images
                SET s_no = ?
                WHERE s_no = ?
            ");

            if ($stmt3) {
                $stmt3->bind_param("ss", $new_sno, $old_sno);
                $stmt3->execute();
                $stmt3->close();
            }

            $custom_updated_count++;
        }

        $next_sno_number++;
    }
}

echo "Custom rows aligned: $custom_updated_count rows.<br>";


// ==========================================
// DONE
// ==========================================

$conn->close();

echo "<br><b>Database Migration Completed Successfully!</b><br>";
echo "Existing custom rows are now shifted according to the current static rows count.";
?>