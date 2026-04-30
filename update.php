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

foreach ($rows as $row) {
    if (!isset($row['row_key'])) continue;
    
    $row_key = mysqli_real_escape_string($conn, $row['row_key']);
    $sno = mysqli_real_escape_string($conn, $row['sno']);
    $barcode = mysqli_real_escape_string($conn, $row['barcode']);
    $status = mysqli_real_escape_string($conn, $row['status']);
    $remarks = mysqli_real_escape_string($conn, $row['remarks']);
    $observation_text = isset($row['observation_text']) ? mysqli_real_escape_string($conn, $row['observation_text']) : '';

    $check_query = "SELECT id FROM verification_of_equipment_serial_numbers WHERE station_id='$station_id' AND row_key='$row_key'";
    $check_result = mysqli_query($conn, $check_query);

    if (mysqli_num_rows($check_result) > 0) {
        $update_query = "
            UPDATE verification_of_equipment_serial_numbers SET 
            S_no='$sno',
            barcode_kavach_main_unit='$barcode',
            observation_status='$status',
            remarks='$remarks',
            observation_text='$observation_text',
            updated_at=NOW()
            WHERE station_id='$station_id'
            AND row_key='$row_key'
        ";
        mysqli_query($conn, $update_query);
    } else {
        $insert_query = "
            INSERT INTO verification_of_equipment_serial_numbers 
            (station_id, row_key, S_no, barcode_kavach_main_unit, observation_status, remarks, observation_text, created_at, updated_at) 
            VALUES 
            ('$station_id', '$row_key', '$sno', '$barcode', '$status', '$remarks', '$observation_text', NOW(), NOW())
        ";
        mysqli_query($conn, $insert_query);
    }
}

$sql_upd = "UPDATE station SET updated_date = NOW() WHERE station_id = $station_id";
mysqli_query($conn, $sql_upd);

echo "success";
mysqli_close($conn);
?>
