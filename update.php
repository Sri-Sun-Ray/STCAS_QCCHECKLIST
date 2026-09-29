<?php
// update.php
error_reporting(E_ALL);
ini_set('display_errors', 0);
header('Content-Type: text/plain');

$conn = mysqli_connect("localhost", "root", "Hbl@1234", "station_info");
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!isset($data['station_id']) || !isset($data['rows'])) {
    echo "error: missing data";
    exit;
}

$station_id = intval($data['station_id']);
$rows = $data['rows'];

$hasRowKey = false;
$colCheck = mysqli_query($conn, "SHOW COLUMNS FROM verification_of_equipment_serial_numbers LIKE 'row_key'");
if ($colCheck && mysqli_num_rows($colCheck) > 0) {
    $hasRowKey = true;
} else {
    if (mysqli_query($conn, "ALTER TABLE verification_of_equipment_serial_numbers ADD COLUMN row_key VARCHAR(100) DEFAULT NULL, ADD INDEX idx_station_rowkey (station_id, row_key)")) {
        $hasRowKey = true;
    }
}

foreach ($rows as $row) {
    if (!isset($row['row_key']) && !isset($row['sno'])) continue;
    
    $row_key = isset($row['row_key']) ? mysqli_real_escape_string($conn, $row['row_key']) : '';
    $sno = isset($row['sno']) ? mysqli_real_escape_string($conn, $row['sno']) : '';
    $barcode = isset($row['barcode']) ? mysqli_real_escape_string($conn, $row['barcode']) : '';
    $status = isset($row['status']) ? mysqli_real_escape_string($conn, $row['status']) : '';
    $remarks = isset($row['remarks']) ? mysqli_real_escape_string($conn, $row['remarks']) : '';
    $observation_text = isset($row['observation_text']) ? mysqli_real_escape_string($conn, $row['observation_text']) : '';

    if ($hasRowKey && !empty($row_key)) {
        $check_query = "SELECT id FROM verification_of_equipment_serial_numbers WHERE station_id='$station_id' AND (row_key='$row_key' OR (S_no='$sno' AND (row_key IS NULL OR row_key='')))";
    } else {
        $check_query = "SELECT id FROM verification_of_equipment_serial_numbers WHERE station_id='$station_id' AND S_no='$sno'";
    }
    $check_result = mysqli_query($conn, $check_query);

    if ($check_result && mysqli_num_rows($check_result) > 0) {
        if ($hasRowKey && !empty($row_key)) {
            $update_query = "
                UPDATE verification_of_equipment_serial_numbers SET 
                S_no='$sno',
                barcode_kavach_main_unit='$barcode',
                observation_status='$status',
                remarks='$remarks',
                observation_text='$observation_text',
                row_key='$row_key',
                updated_at=NOW()
                WHERE station_id='$station_id'
                AND (row_key='$row_key' OR (S_no='$sno' AND (row_key IS NULL OR row_key='')))
            ";
        } else {
            $update_query = "
                UPDATE verification_of_equipment_serial_numbers SET 
                barcode_kavach_main_unit='$barcode',
                observation_status='$status',
                remarks='$remarks',
                observation_text='$observation_text',
                updated_at=NOW()
                WHERE station_id='$station_id'
                AND S_no='$sno'
            ";
        }
        mysqli_query($conn, $update_query);
    } else {
        if ($hasRowKey && !empty($row_key)) {
            $insert_query = "
                INSERT INTO verification_of_equipment_serial_numbers 
                (station_id, row_key, S_no, barcode_kavach_main_unit, observation_status, remarks, observation_text, created_at, updated_at) 
                VALUES 
                ('$station_id', '$row_key', '$sno', '$barcode', '$status', '$remarks', '$observation_text', NOW(), NOW())
            ";
        } else {
            $insert_query = "
                INSERT INTO verification_of_equipment_serial_numbers 
                (station_id, S_no, barcode_kavach_main_unit, observation_status, remarks, observation_text, created_at, updated_at) 
                VALUES 
                ('$station_id', '$sno', '$barcode', '$status', '$remarks', '$observation_text', NOW(), NOW())
            ";
        }
        mysqli_query($conn, $insert_query);
    }
}

$sql_upd = "UPDATE station SET updated_date = NOW() WHERE station_id = $station_id";
mysqli_query($conn, $sql_upd);

echo "success";
mysqli_close($conn);
?>
