<?php
ini_set('display_errors', 0);
error_reporting(E_ALL);
header("Content-Type: application/json");

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (isset($_POST['station_id'], $_POST['s_no'], $_POST['table_name'])) {
            $stationId = $_POST['station_id'];
            $s_no = $_POST['s_no'];
            $tableName = $_POST['table_name'];

            // Allow only specific observation tables for deletion
            $allowedTables = [
                "verification_of_equipment_serial_numbers", "tower", "rtu", "rf_antennas", 
                "installation_of_kavach_equipment", "networking_rack", "ips", "dc_convertor", 
                "pdu", "smocip", "gps_gsm_antenna", "relay_rack", "riu", 
                "laying_of_sectional_ofc_cable", "outdoor_cabling", "rfid_tags", "tag_to_tag_distance"
            ];

            if (!in_array($tableName, $allowedTables)) {
                echo json_encode(['success' => false, 'message' => 'Invalid table name']);
                exit;
            }

            // Database connection
            $pdo = new PDO('mysql:host=localhost;dbname=station_info', 'root', 'Hbl@1234');
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $pdo->beginTransaction();

            // Delete from observations table
            $stmt = $pdo->prepare("DELETE FROM $tableName WHERE station_id = ? AND S_no = ?");
            $stmt->execute([$stationId, $s_no]);

            // Delete associated images
            $imgStmt = $pdo->prepare("DELETE FROM images WHERE station_id = ? AND s_no = ? AND entity_type = ?");
            $imgStmt->execute([$stationId, $s_no, $tableName]);

            $pdo->commit();

            if ($stmt->rowCount() > 0) {
                echo json_encode(['success' => true, 'message' => 'Observation deleted successfully']);
            } else {
                // If it was not in the database, it might essentially be "deleted" if the frontend thinks so, 
                // but checking rowCount 0 usually means nothing was there.
                // We'll return true to allow UI to remove it if it was just a ghost.
                // But strictly, let's say "Observation not found" but success=true so UI removes it?
                // Better to be explicit.
                echo json_encode(['success' => true, 'message' => 'Observation not found in DB, but removed from request.']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    }
} catch (Exception $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>
