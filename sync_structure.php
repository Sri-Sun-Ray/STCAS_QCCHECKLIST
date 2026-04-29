<?php
// sync_structure.php
error_reporting(E_ALL);
ini_set('display_errors', 0);
header('Content-Type: text/plain');

$conn = mysqli_connect("localhost", "root", "Hbl@1234", "station_info");
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
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

    // Delete obsolete rows from main table
    mysqli_query($conn, "
        DELETE FROM verification_of_equipment_serial_numbers 
        WHERE station_id='$station_id'
        AND (row_key NOT IN ($keys) OR row_key IS NULL OR row_key = '')
    ");

    // Delete obsolete images from the images table
    mysqli_query($conn, "
        DELETE FROM images 
        WHERE station_id='$station_id'
        AND (row_key NOT IN ($keys) OR row_key IS NULL OR row_key = '')
        AND entity_type='verification_of_equipment_serial_numbers'
    ");
}

echo "Sync complete";
mysqli_close($conn);
?>
