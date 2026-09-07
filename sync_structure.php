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
$updated_requirements = [
    "2.1" => "Building Commissioning Report from the contractor shall be available with the customer's sign-off, and there shall be no open points in the report.",
    "3.1" => "Tower Commissioning Report from the contractor shall be available with the customer's sign-off, and there shall be no open points in the report.",
    "4.1.1" => "IPS PDU unit shall be mounted on the wall using M8 insulators, secured with M8 bolts, and tightened to a torque of 7 Nm as per diagram 5 16 76 0053",
    "4.1.2" => "Station PDU unit shall be mounted on the wall using M8 insulators, secured with M8 bolts, and tightened to a torque of 7 Nm as per diagram 5 16 76 0054",
    "4.1.3" => "All external cables entering the PDU shall pass through cable glands and ensure no cable entry opening.",
    "4.1.4" => "Output connections shall be maintained as per the Station PDU schematic diagram 5 16 49 0671",
    "4.1.5" => "Ensure lugs with sleeves / Ferrules are properly crimped and inserted into the terminal; no loose strands shall be left.",
    "4.1.6" => "PDU units shall be connected to the ring earth/busbar using a 10 sq.mm green/yellow earthing wire, and bolts shall be tightened to a torque of 5 Nm with torque marking applied.",
    "4.1.7" => "Crimping of lugs on earthing cables shall be carried out, and self-vulcanizing utility tape shall be applied.",
    "4.1.8" => "Functional testing shall be performed as per the PDU test procedure 5 53 20 0024.",
    "4.2.1" => "DC-DC Converter unit shall be installed as per the approved floor plan drawing, mounted on floor using M10 insulators, secured with M10 bolts, and tightened to a torque of 8 Nm as per diagram 5 16 76 0055",
    "4.2.2" => "All external cables entering the unit shall pass through cable glands and ensure no cable entry opening.",
    "4.2.3" => "Unit shall be connected to the ring earth/busbar using a 10 sq.mm green/yellow earthing wire, and bolts shall be tightened to a torque of 5 Nm with torque marking applied.",
    "4.2.4" => "Crimping of lugs on earthing cables shall be carried out, and self-vulcanizing utility tape shall be applied.",
    "4.2.5" => "DC-DC converter output voltage shall be minimum 24 V DC, +/- 5% (22.8 VDC to 25.2 VDC)",
    "5.1.1" => "Kavach unit shall be installed as per the approved floor plan drawing, mounted on the floor using M10 insulators, secured with M10 bolts, and tightened to a torque of 8 Nm as per diagram 5 16 76 0056.",
    "5.1.2" => "All external cables shall enter through cable glands only. No unused cable entries left open. Ensure mill connector shall be locked properly.",
    "5.1.3" => "Unit shall be connected to the ring earth/busbar using a 10 sq.mm green/yellow earthing wire, and bolts shall be tightened to a torque of 5 Nm with torque marking applied.",
    "5.1.4" => "Crimping of lugs on earthing cables shall be carried out, and self-vulcanizing utility tape shall be applied.",
    "5.1.5" => "Station Kavach Termination Unit shall be wall-mounted near the Kavach unit using insulators, secured with M8 bolts, and tightened to a torque of 7 Nm as per diagram 5 16 76 0045.",
    "5.1.6" => "OFC cables for SMOCIP and RTU shall be spliced as per diagram 5 16 49 0559, and proper bunching and routing shall be ensured.",
    "5.2.1" => "SMOCIP shall be installed in the Station Master’s room at an ergonomic height. The panel shall be securely fixed using M6 screws and tightened to a torque of 5 Nm with torque marking applied, as per diagram 5 16 76 0040",
    "5.2.2" => "SMOCIP Termination Unit shall be wall-mounted near the SMOCIP unit, using insulators, secured with M6 bolts, and tightened to a torque of 5 Nm as per diagram 5 16 76 0046",
    "5.2.3" => "Power and OFC cables from Kavach termination unit shall be terminated as per diagram 5 16 49 0559.",
    "5.2.4" => "OFC cables of SMOCIP shall be spliced as per diagram 5 16 49 0559, and proper bunching and routing shall be ensured.",
    "5.2.5" => "Unit shall be connected to the ring earth/busbar using a 10 sq.mm green/yellow earthing wire, and bolts shall be tightened to a torque of 5 Nm with torque marking applied.",
    "5.2.6" => "Crimping of lugs on earthing cables shall be carried out, and self-vulcanizing utility tape shall be applied.",
    "5.2.7" => "System Health LED shall blink and ensure SYSTEM OK along with the respective station name shall be displayed on the Display.",
    "5.2.8" => "Verify that pressing the SOS and Common buttons on the SM-OCIP increments the mechanical counter by one.",
    "5.2.9" => "Verify the checksums as per the FAT certificate.",
    "5.3.1" => "Two antennas shall be installed on the Kavach room rooftop with a minimum separation of 3 meters, grouting shall be carried out as per diagram 5 16 67 0039, and torque of 5 Nm shall be applied for M6 fasteners with torque marking provided.",
    "5.3.2" => "No obstruction above antennas like tree branches, sun-shades, and ensure open to sky etc.",
    "5.3.3" => "Antenna cables shall be routed via diverse paths.",
    "5.3.4" => "Separate conduits shall be used and Roof conduits shall be sealed against dust, water, and insects.",
    "5.3.5" => "In each antenna, the GPS and GSM cables shall be connected to their respective connectors as per the labels provided on the antenna.",
    "5.4.1" => "RIU shall be installed on floor using M10 insulators, secured with M10 bolts, and tightened to a torque of 8 Nm as per diagram 5 16 76 0057.",
    "5.4.2" => "All external cables entering into the RIU unit shall pass through cable glands and ensure no cable entry opening .",
    "5.4.3" => "OFC patch cords shall be properly tagged to identify default and standby links.",
    "5.4.4" => "Unit shall be connected to the ring earth/busbar using a 10 sq.mm green/yellow earthing wire, and bolts shall be tightened to a torque of 5 Nm with torque marking applied.",
    "5.4.5" => "Crimping of lugs on earthing cables shall be carried out, and self-vulcanizing utility tape shall be applied.",
    "5.4.6" => "FDMS Box shall be installed in the 15U/17U rack of the RIU with proper wall mounting, and OFC splicing shall be carried out as per the network drawing.",
    "5.5.1" => "EI protocol converter shall be installed on floor using M10 insulators, secured with M10 bolts, and tightened to a torque of 8 Nm or unit shall be mounted on wall with M10 nut & Bolts as per respective diagram.",
    "5.5.2" => "All external cables entering into the EI protocol converter unit shall pass through cable glands and ensure no cable entry opening without a cable glands/grommets.",
    "5.5.3" => "Unit shall be connected to the ring earth/bus bar using a 10 sq.mm green/yellow earthing wire, and bolts shall be tightened to a torque of 5 NM with torque marking applied.",
    "5.5.4" => "Crimping of lugs on earthing cables shall be carried out, and self-vulcanizing utility tape shall be applied.",
    "5.5.5" => "Verify the EI Interface Test Report is available in WFMS with OEM and customer sign-off, and there are no open points.",
    "6.1.1" => "Both RTUs shall be firmly secured to the tower platform using M12 bolts and nuts, and a torque of 42 Nm shall be applied as per diagram 5 16 67 0983.",
    "6.1.2" => "Ensure RTU doors are fully closed and locked.",
    "6.1.3" => "RTU shall be properly earthed by connecting a 35 sq.mm green to GI strip earthing conductor from the RTU earthing bolt to the designated earth pit-4, as per diagram 5 16 76 0043.",
    "6.1.4" => "Crimping of lugs on earthing cables shall be carried out, and self-vulcanizing utility tape shall be applied.",
    "6.1.5" => "OFC cable from the Relay Room shall be spliced and terminated in the splice holder inside the RTU.(Ref. Drawing: 5 16 49 0559)",
    "6.1.6" => "OFC cables for RTU shall be spliced as per diagram 5 16 49 0559 and ensure bunching and routing shall be done properly.",
    "6.1.7" => "Cable glands used for 110 V DC power cable entry into RTU shall be firmly tightened.",
    "6.1.8" => "110 V DC power cables shall be terminated on RTU MCB as per diagram 5 16 49 0672.",
    "6.1.9" => "Ensure lugs with sleeves / Ferrules are properly crimped and inserted into the terminal; no loose strands shall be left.",
    "6.1.10" => "LMR 600 connection with proper routing; and clamping; No Joints shall be done, as per Tower SOP 5 16 90 0018.",
    "6.1.11" => "Radio power shall be configured as 10W.",
    "6.2.1" => "RF antenna installation and orientation shall be done as per 10.2dBi omni-directional anteena diagram 5 16 67 0983.",
    "6.2.2" => "RF antenna installation audit report from the installation contractor shall be available in WFMS and there shall be no open points in the audit report.",
    "7.1" => "Network rack shall be installed as per approved floor plan and installation shall be done as per diagram 5 16 76 0058.",
    "7.2" => "Patch cord routing shall be neat & bend radius to be maintained.",
    "7.3" => "All external cables entering the network rack shall pass through the grommets.",
    "7.4" => "OFC cables shall be marked using naming tie-tags for easy identification of default and standby links.",
    "7.5" => "All networking modules inside the rack shall be connected to the rack chassis using 2.5 sq.mm green/yellow earthing wire.",
    "7.6" => "Network rack shall be connected to ring earth using a 10 sq.mm green/yellow earthing wire.",
    "7.7" => "Bolts shall be tightened to a torque of 5 Nm, and torque marking shall be applied using yellow paint.",
    "7.8" => "OFC cables shall be spliced in the FDMS box as per network drawing.",
    "7.9" => "FDMS boxes shall be clearly marked to identify up and down links.",
    "7.10" => "OTDR test reports shall be available.",
    "8.1" => "Relay rack shall be installed as per the approved Floor Plan drawing, mounted on insulators, and secured to the floor by grouting as per diagram 5 16 76 0059.",
    "8.2" => "Labeling sleeve shall be used to identify wiring with rack number, row number, relay number & contact type, Labelling shall be provided to relay contact wires at FTC PCBA of Station Kavach.",
    "8.3" => "For EI Stations, verify all connections as per the approved EI Interface diagrams (vendor specific).",
    "8.4" => "WAGO terminal details shall be as per interface circuit diagram 5 16 49 0685.",
    "8.5" => "Completed Station Analyser and Bell Test reports shall be available.",
    "8.6" => "Unit shall be connected to the ring earth/busbar using a 10 sq.mm green/yellow earthing wire, and bolts shall be tightened to a torque of 5 Nm with torque marking applied.",
    "8.7" => "Crimping of lugs on earthing cables shall be carried out, and self-vulcanizing utility tape shall be applied.",
    "9.1" => "Earthing shall be done as per RDSO Spec RDSO/SPN/197/2008",
    "9.2" => "Earth resistance shall be measured using a calibrated earth resistance tester. The measured value shall be lessthan or equal to 1 Ohm.",
    "9.2.1" => "Check the value of earth resistance at earth of the radio tower. The measured value shall be lessthan or equal to 2 Ohm.",
    "9.3" => "Earth resistance test reports shall be available",
    "9.4" => "All earth pits, earthing conductors, and earth points shall be clearly labelled and identifiable.",
    "10.1" => "Cabling shall be done as per station connectivity diagram 5 16 49 0614 Segregation of power & communication cables.",
    "10.2" => "12 Core Signaling cable shall be used for button, counter & power supply. OFC armoured cables shall be used for communication.",
    "10.3" => "No joints permitted except inside junction boxes or panels.",
    "10.4" => "Colour codes shall be followed for phase, neutral, and earth.",
    "10.5" => "Cables shall be tagged at both ends.",
    "10.6" => "Proper lugs/ferrules shall be used and terminals tightened correctly.",
    "11.1" => "Railway-approved outdoor signalling cable route plan shall be available.",
    "11.2" => "Route markers shall be installed and clearly visible.",
    "12.1" => "Ensure the main RFID tag is installed in the direction specified in the RFID tag layout, and a duplicate RFID tag shall be installed at a distance of 3–5 meters from the main tag, except for turnout tags.",
    "12.2" => "RFID tag mounting shall be firm and secure, ensuring no gap or mechanical play as per RFID tag installation procedure 5 53 76 0055.",
    "12.3" => "System-generated RFID data validation report and Placement verification report shall be available.",
    "12.4" => "All RFID Point Tags are installed using the FRP Tag Mounting Base.",
    "13.1" => "Verify that all subcontractors and HBL personnel use only approved make and part numbers as per the List of Acceptable I&C Materials EG-EN-FT-34.",
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
