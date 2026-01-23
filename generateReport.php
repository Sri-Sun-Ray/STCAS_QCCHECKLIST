<?php
// Make sure this file is named 'generateReport.php' and is located at c:\xampp\htdocs\STCAS_QCCHECKLIST\

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Cache-Control: no-cache, no-store, must-revalidate"); // HTTP 1.1.
header("Pragma: no-cache"); // HTTP 1.0.
header("Expires: 0"); // Proxies.

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

if (!isset($_POST['station-id'], $_POST['division'], $_POST['zone'],$_POST['section-name'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing necessary POST data']);
    exit;
}

$stationID = htmlspecialchars($_POST['station-id']);
$division = htmlspecialchars($_POST['division']);
$zone = htmlspecialchars($_POST['zone']);
$sectionName=htmlspecialchars($_POST['section-name']);


try {
    $pdo = new PDO('mysql:host=localhost;dbname=station_info', 'root', 'Hbl@1234', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);

    // Fetch station details
    $stationQuery = "SELECT station_id, station_name, railway_zone, division, section_name, initial_date, updated_date
                  FROM station
                  WHERE station_id = ? AND railway_zone = ? AND division = ? AND section_name = ?";
    $stationStmt = $pdo->prepare($stationQuery);
    $stationStmt->execute([$stationID, $zone, $division,$sectionName]);
    $stationDetails = $stationStmt->fetch();
    $helloDetails=$stationStmt->fetch();

    if (!$stationDetails) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Station details not found.']);
        exit;
    }

    $tableNames = [
    "verification_of_equipment_serial_numbers","tower", "rtu","rf_antennas","installation_of_kavach_equipment",
    "networking_rack", "ips", "dc_convertor", "pdu","smocip","gps_gsm_antenna","relay_rack","riu","laying_of_sectional_ofc_cable","outdoor_cabling","rfid_tags","tag_to_tag_distance",

];

    $observations = [];

    // Go through each observation table
    foreach ($tableNames as $index => $tableName) {
        $section_id_for_frontend = ($index + 2) . "_0";

        // Fetch images specifically for this table/section
        $imageQuery = "SELECT S_no, image_path FROM images WHERE station_id = ? AND entity_type = ?";
        $imageStmt = $pdo->prepare($imageQuery);
        $imageStmt->execute([$stationID, $tableName]);
        $sectionImages = $imageStmt->fetchAll(PDO::FETCH_GROUP | PDO::FETCH_COLUMN);

        // Check if barcode_kavach_main_unit column exists in this table
        $extraCol = "";
        if ($tableName === 'verification_of_equipment_serial_numbers') {
            $extraCol = ", barcode_kavach_main_unit";
        }

        $query = "SELECT S_no, observation_text, requirement_text, remarks, observation_status, '$section_id_for_frontend' as section_id $extraCol
                  FROM $tableName
                  WHERE station_id = ?";
        $stmt = $pdo->prepare($query);
        $stmt->execute([$stationID]);
        $tableObservations = $stmt->fetchAll();

        foreach ($tableObservations as &$obs) {
            $imagesForThisSno = $sectionImages[$obs['S_no']] ?? [];

            $validImages = [];
            foreach ($imagesForThisSno as $imagePath) {
                if (file_exists(__DIR__ . '/' . $imagePath) && strpos($imagePath, 'uploads/') === 0) {
                    $validImages[] = "http://localhost/STCAS_QCCHECKLIST/" . $imagePath;
                }
            }

            $obs['images'] = $validImages;
        }

        $observations = array_merge($observations, $tableObservations);
    }

    echo json_encode([
        'success' => true,
        'stationDetails' => $stationDetails,
        'helloDetails' =>$helloDetails,
        'observations' => $observations
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
