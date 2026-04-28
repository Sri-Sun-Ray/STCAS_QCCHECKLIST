<?php
// Database Update Script for Section 2 only

$conn = new mysqli("localhost", "root", "Hbl@1234", "station_info");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$conn->begin_transaction();

try {

    $SECTION_ID = "2_0";

    // ==========================================
    // 1. SHIFT SECTION 2 S_NO AFTER REMOVAL OF 1.53
    // ==========================================
    // old 1.54 -> new 1.53
    // old 1.55 -> new 1.54
    // ...
    // old 1.64 -> new 1.63

    $SHIFT_START = 64;
    $SHIFT_END = 54;

    // Step 1: Move old values to TEMP first
    for ($i = $SHIFT_START; $i >= $SHIFT_END; $i--) {
        $old_sno = "1.$i";
        $temp_sno = "TEMP_1.$i";

        // Main Section 2 observation table
        $stmt = $conn->prepare("
            UPDATE verification_of_equipment_serial_numbers
            SET S_no = ?
            WHERE S_no = ?
        ");
        $stmt->bind_param("ss", $temp_sno, $old_sno);
        $stmt->execute();
        $stmt->close();

        // Row template only for Section 2
        $stmt = $conn->prepare("
            UPDATE row_templates
            SET s_no = ?
            WHERE section_id = ?
            AND s_no = ?
        ");
        $stmt->bind_param("sss", $temp_sno, $SECTION_ID, $old_sno);
        $stmt->execute();
        $stmt->close();

        // Images for Section 2
        $stmt = $conn->prepare("
            UPDATE images
            SET s_no = ?
            WHERE section_id = ?
            AND s_no = ?
        ");
        $stmt->bind_param("sss", $temp_sno, $SECTION_ID, $old_sno);
        $stmt->execute();
        $stmt->close();
    }

    // Step 2: Delete old removed point 1.53
    $delete_sno = "1.53";

    $stmt = $conn->prepare("
        DELETE FROM verification_of_equipment_serial_numbers
        WHERE S_no = ?
    ");
    $stmt->bind_param("s", $delete_sno);
    $stmt->execute();
    $stmt->close();

    $stmt = $conn->prepare("
        DELETE FROM row_templates
        WHERE section_id = ?
        AND s_no = ?
    ");
    $stmt->bind_param("ss", $SECTION_ID, $delete_sno);
    $stmt->execute();
    $stmt->close();

    $stmt = $conn->prepare("
        DELETE FROM images
        WHERE section_id = ?
        AND s_no = ?
    ");
    $stmt->bind_param("ss", $SECTION_ID, $delete_sno);
    $stmt->execute();
    $stmt->close();

    // Step 3: Move TEMP values to final S_no
    for ($i = $SHIFT_START; $i >= $SHIFT_END; $i--) {
        $temp_sno = "TEMP_1.$i";
        $new_sno = "1." . ($i - 1);

        $stmt = $conn->prepare("
            UPDATE verification_of_equipment_serial_numbers
            SET S_no = ?
            WHERE S_no = ?
        ");
        $stmt->bind_param("ss", $new_sno, $temp_sno);
        $stmt->execute();
        $stmt->close();

        $stmt = $conn->prepare("
            UPDATE row_templates
            SET s_no = ?
            WHERE section_id = ?
            AND s_no = ?
        ");
        $stmt->bind_param("sss", $new_sno, $SECTION_ID, $temp_sno);
        $stmt->execute();
        $stmt->close();

        $stmt = $conn->prepare("
            UPDATE images
            SET s_no = ?
            WHERE section_id = ?
            AND s_no = ?
        ");
        $stmt->bind_param("sss", $new_sno, $SECTION_ID, $temp_sno);
        $stmt->execute();
        $stmt->close();
    }

    // ==========================================
    // 2. RENAME SECTION 2 OBSERVATION TEXT
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

    foreach ($renamed_points as $s_no => $new_text) {
        $stmt = $conn->prepare("
            UPDATE verification_of_equipment_serial_numbers
            SET observation_text = ?
            WHERE S_no = ?
        ");
        $stmt->bind_param("ss", $new_text, $s_no);
        $stmt->execute();
        $stmt->close();

        $stmt = $conn->prepare("
            UPDATE row_templates
            SET description = ?
            WHERE section_id = ?
            AND s_no = ?
        ");
        $stmt->bind_param("sss", $new_text, $SECTION_ID, $s_no);
        $stmt->execute();
        $stmt->close();
    }

    // ==========================================
    // 3. UPDATE STATUS VALUES
    // ==========================================
    $status_updates_by_sno = [
        "1.44" => [
            "Matching" => "Verified",
            "Not Matching" => "Not Verified"
        ]
    ];

    foreach ($status_updates_by_sno as $s_no => $updates) {
        foreach ($updates as $old_status => $new_status) {
            $stmt = $conn->prepare("
                UPDATE verification_of_equipment_serial_numbers
                SET observation_status = ?
                WHERE observation_status = ?
                AND S_no = ?
            ");
            $stmt->bind_param("sss", $new_status, $old_status, $s_no);
            $stmt->execute();
            $stmt->close();
        }
    }

    // ==========================================
    // 4. AUTO-ALIGN CUSTOM ROWS FOR SECTION 2
    // ==========================================
    $STANDARD_LIMIT = 68;

    $all_custom = $conn->query("
        SELECT id, s_no
        FROM row_templates
        WHERE section_id = '$SECTION_ID'
        AND s_no LIKE '1.%'
        ORDER BY id ASC
    ");

    $next_available_index = $STANDARD_LIMIT + 1;

    while ($c_row = $all_custom->fetch_assoc()) {
        $old_sno = $c_row['s_no'];
        $new_sno = "1." . $next_available_index;

        if ($old_sno !== $new_sno) {
            $id = $c_row['id'];

            $stmt = $conn->prepare("
                UPDATE row_templates
                SET s_no = ?
                WHERE id = ?
            ");
            $stmt->bind_param("si", $new_sno, $id);
            $stmt->execute();
            $stmt->close();

            $stmt = $conn->prepare("
                UPDATE verification_of_equipment_serial_numbers
                SET S_no = ?
                WHERE S_no = ?
            ");
            $stmt->bind_param("ss", $new_sno, $old_sno);
            $stmt->execute();
            $stmt->close();

            $stmt = $conn->prepare("
                UPDATE images
                SET s_no = ?
                WHERE section_id = ?
                AND s_no = ?
            ");
            $stmt->bind_param("sss", $new_sno, $SECTION_ID, $old_sno);
            $stmt->execute();
            $stmt->close();
        }

        $next_available_index++;
    }

    $conn->commit();

    echo "<br><b>Section 2 migration completed successfully.</b><br>";
    echo "Old 1.54 data should now become 1.53.";

} catch (Exception $e) {
    $conn->rollback();
    echo "<br><b>Migration Failed:</b> " . $e->getMessage();
}

$conn->close();
?>