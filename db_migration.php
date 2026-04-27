<?php
// Database Update Script for Checklist Modifications with Log Debugging

$LOG_FILE = __DIR__ . "/db_migration_debug.log";

function logMsg($msg) {
    global $LOG_FILE;
    file_put_contents(
        $LOG_FILE,
        "[" . date("Y-m-d H:i:s") . "] " . $msg . PHP_EOL,
        FILE_APPEND
    );
}

logMsg("==================================================");
logMsg("DB MIGRATION STARTED");

$conn = new mysqli("localhost", "root", "Hbl@1234", "station_info");

if ($conn->connect_error) {
    logMsg("DB CONNECTION FAILED: " . $conn->connect_error);
    die("Connection failed: " . $conn->connect_error);
}

$conn->set_charset("utf8mb4");
logMsg("DB CONNECTED SUCCESSFULLY");

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

$SECTION_ID = "2_0";
$STATIC_ROWS_COUNT = 68;

logMsg("SECTION_ID = $SECTION_ID");
logMsg("STATIC_ROWS_COUNT = $STATIC_ROWS_COUNT");

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

    foreach ($tables as $table) {
        $stmt = $conn->prepare("DELETE FROM `$table` WHERE S_no IN ($placeholders)");

        if ($stmt) {
            $stmt->bind_param($types, ...$deleted_points);
            $stmt->execute();
            logMsg("DELETE $table affected_rows = " . $stmt->affected_rows);
            $stmt->close();
        } else {
            logMsg("DELETE PREPARE FAILED $table: " . $conn->error);
        }
    }
} else {
    logMsg("No deleted_points configured");
}

// ==========================================
// 2. UPDATE / RENAME STATIC OBSERVATION TEXT
// ==========================================

$renamed_points = [
    // "1.39" => "SMOCIP Unit",
];

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
            logMsg("RENAME $table S_no=$s_no affected_rows=" . $stmt->affected_rows);
            $stmt->close();
        } else {
            logMsg("RENAME PREPARE FAILED $table: " . $conn->error);
        }
    }
}

if (empty($renamed_points)) {
    logMsg("No renamed_points configured");
}

// ==========================================
// 3. UPDATE REQUIREMENT TEXT
// ==========================================

$updated_requirements = [
    // "4.1.8" => "Functional testing shall be performed as per the PDU test procedure 5 53 20 0024."
];

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
            logMsg("REQ UPDATE $table S_no=$s_no affected_rows=" . $stmt->affected_rows);
            $stmt->close();
        } else {
            logMsg("REQ PREPARE FAILED $table: " . $conn->error);
        }
    }
}

if (empty($updated_requirements)) {
    logMsg("No updated_requirements configured");
}

// ==========================================
// 4. UPDATE STATUS VALUES
// ==========================================

$status_updates_by_sno = [
    // "1.44" => [
    //     "Matching" => "Verified",
    //     "Not Matching" => "Not Verified"
    // ]
];

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
                logMsg("STATUS UPDATE $table S_no=$s_no $old_status->$new_status affected_rows=" . $stmt->affected_rows);
                $stmt->close();
            } else {
                logMsg("STATUS PREPARE FAILED $table: " . $conn->error);
            }
        }
    }
}

if (empty($status_updates_by_sno)) {
    logMsg("No status_updates_by_sno configured");
}

// ==========================================
// 5. MOVE / RENAME STATIC S_NO
// ==========================================

$moved_sno_points = [
    // "1.54" => "1.53"
];

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
            logMsg("MOVE S_NO $table $old_sno->$new_sno affected_rows=" . $stmt->affected_rows);
            $stmt->close();
        } else {
            logMsg("MOVE PREPARE FAILED $table: " . $conn->error);
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
        logMsg("MOVE IMAGE $old_sno->$new_sno affected_rows=" . $stmtImg->affected_rows);
        $stmtImg->close();
    }
}

if (empty($moved_sno_points)) {
    logMsg("No moved_sno_points configured");
}

// ==========================================
// 6. AUTO ALIGN ROW_TEMPLATES AND SAVED ROWS
// ==========================================

logMsg("AUTO ALIGN STARTED");

$all_rows = $conn->query("
    SELECT id, s_no, description
    FROM row_templates
    WHERE section_id = '$SECTION_ID'
    ORDER BY id ASC
");

if (!$all_rows) {
    logMsg("ROW_TEMPLATE QUERY FAILED: " . $conn->error);
    die("row_templates query failed: " . $conn->error);
}

logMsg("row_templates rows fetched = " . $all_rows->num_rows);

$index = 1;
$updated_count = 0;

while ($row = $all_rows->fetch_assoc()) {
    $template_id = (int)$row["id"];
    $old_sno = trim($row["s_no"]);
    $new_sno = "1." . $index;
    $description = trim($row["description"]);

    logMsg("CHECK ROW id=$template_id old_sno=$old_sno new_sno=$new_sno description=$description");

    if ($old_sno !== $new_sno) {
        logMsg("UPDATING ROW id=$template_id old_sno=$old_sno new_sno=$new_sno");

        $stmt1 = $conn->prepare("
            UPDATE row_templates
            SET s_no = ?
            WHERE id = ?
        ");

        if ($stmt1) {
            $stmt1->bind_param("si", $new_sno, $template_id);
            $stmt1->execute();
            logMsg("row_templates affected_rows=" . $stmt1->affected_rows);
            $stmt1->close();
        } else {
            logMsg("row_templates prepare failed: " . $conn->error);
        }

        $stmt2 = $conn->prepare("
            UPDATE verification_of_equipment_serial_numbers
            SET S_no = ?
            WHERE S_no = ?
              AND LOWER(TRIM(observation_text)) LIKE CONCAT(LOWER(TRIM(?)), '%')
        ");

        if ($stmt2) {
            $stmt2->bind_param("sss", $new_sno, $old_sno, $description);
            $stmt2->execute();
            logMsg("verification affected_rows=" . $stmt2->affected_rows);
            $stmt2->close();
        } else {
            logMsg("verification prepare failed: " . $conn->error);
        }

        $stmt3 = $conn->prepare("
            UPDATE images
            SET s_no = ?
            WHERE s_no = ?
        ");

        if ($stmt3) {
            $stmt3->bind_param("ss", $new_sno, $old_sno);
            $stmt3->execute();
            logMsg("images affected_rows=" . $stmt3->affected_rows);
            $stmt3->close();
        } else {
            logMsg("images prepare failed: " . $conn->error);
        }

        $updated_count++;
    } else {
        logMsg("NO CHANGE id=$template_id");
    }

    $index++;
}

logMsg("AUTO ALIGN FINISHED updated_count=$updated_count");

$conn->close();

logMsg("DB MIGRATION FINISHED");
logMsg("==================================================");

echo "Database Migration Completed Successfully. Check db_migration_debug.log";
?>