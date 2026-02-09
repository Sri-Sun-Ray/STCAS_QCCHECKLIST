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
    $stationQuery = "SELECT id, station_id, station_name, railway_zone, division, section_name, initial_date, updated_date
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

    // Get internal station ID for querying observations
    $internalStationId = $stationDetails['id'];
    error_log("[generateReport] Query result - external: {$stationID}, internal: {$internalStationId}");

    // Explicit mapping of database tables to frontend section IDs and image entity types
    // Format: "table_name" => ["id" => "section_id", "img_entity" => "entity_type_in_images_table"]
    $tableMap = [
        "verification_of_equipment_serial_numbers" => ["id" => "2_0", "img_entity" => "verification_of_equipment_serial_numbers"],
        "tower"                                    => ["id" => "3_0", "img_entity" => "tower"],
        "rtu"                                      => ["id" => "4_0", "img_entity" => "rtu"],
        "rf_antennas"                              => ["id" => "5_0", "img_entity" => "rf_antennas"],
        "installation_of_kavach_equipment"         => ["id" => "6_0", "img_entity" => "installation_of_kavach_equipment"],
        "networking_rack"                          => ["id" => "7_0", "img_entity" => "networking_rack"],
        "ips"                                      => ["id" => "8_0", "img_entity" => "ips"],
        "dc_convertor"                             => ["id" => "9_0", "img_entity" => "dc_convertor"],
        "pdu"                                      => ["id" => "10_0", "img_entity" => "pdu"],
        "smocip"                                   => ["id" => "11_0", "img_entity" => "smocip"],
        "outdoor_cabling"                          => ["id" => "12_0", "img_entity" => "outdoor_cabling"],
        "relay_rack"                               => ["id" => "13_0", "img_entity" => "relay_rack"],
        "riu"                                      => ["id" => "14_0", "img_entity" => "riu"],
        "laying_of_sectional_ofc_cable"            => ["id" => "15_0", "img_entity" => "laying_of_sectional_ofc_cable"],
        "gps_gsm_antenna"                          => ["id" => "16_0", "img_entity" => "gps_gsm_antenna"],
        "rfid_tags"                                => ["id" => "17_0", "img_entity" => "rfid_tags"],
        "tag_to_tag_distance"                      => ["id" => "18_0", "img_entity" => "tag_to_tag_distance"],
    ];

    $observations = [];

    // Go through each mapped table
    $debug_sections = [];
    foreach ($tableMap as $tableName => $config) {
        $section_id_for_frontend = $config['id'];
        $image_entity_type = $config['img_entity'];
        
        error_log("[generateReport] Processing section: {$section_id_for_frontend}, table: {$tableName}, image_entity: {$image_entity_type}");

        // Fetch images specifically for this table/section using the correct entity type
        $imageQuery = "SELECT S_no, image_path FROM images WHERE station_id = ? AND entity_type = ?";
        $imageStmt = $pdo->prepare($imageQuery);
        $imageStmt->execute([$stationID, $image_entity_type]);
        $sectionImages = $imageStmt->fetchAll(PDO::FETCH_GROUP | PDO::FETCH_COLUMN);
        
        // For section 13, also check rfid_tags entity type (for backward compatibility)
        if ($section_id_for_frontend === '13_0' && count($sectionImages) === 0) {
            error_log("[generateReport] No images found with entity_type=relay_rack for section 13, trying rfid_tags");
            $fallbackImageQuery = "SELECT S_no, image_path FROM images WHERE station_id = ? AND entity_type = 'rfid_tags'";
            $fallbackImageStmt = $pdo->prepare($fallbackImageQuery);
            $fallbackImageStmt->execute([$stationID]);
            $sectionImages = $fallbackImageStmt->fetchAll(PDO::FETCH_GROUP | PDO::FETCH_COLUMN);
        }
        
        error_log("[generateReport] Found " . count($sectionImages) . " images for section {$section_id_for_frontend}");

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
        
        // Special fallback for section 13: if no data in relay_rack, check rfid_tags (for backward compatibility with old saves)
        if (count($tableObservations) === 0 && $section_id_for_frontend === '13_0' && $tableName === 'relay_rack') {
            error_log("[generateReport] No data in relay_rack for section 13, trying rfid_tags fallback");
            $fallbackQuery = "SELECT S_no, observation_text, requirement_text, remarks, observation_status, '$section_id_for_frontend' as section_id FROM rfid_tags WHERE station_id = ? AND S_no LIKE '12.%'";
            $fallbackStmt = $pdo->prepare($fallbackQuery);
            $fallbackStmt->execute([$stationID]);
            $tableObservations = $fallbackStmt->fetchAll();
            if (count($tableObservations) > 0) {
                error_log("[generateReport] Found " . count($tableObservations) . " observations in rfid_tags fallback for section 13");
            }
        }
        
        if (count($tableObservations) > 0) {
            error_log("[generateReport] Found " . count($tableObservations) . " observations from {$tableName} for section {$section_id_for_frontend}: " . json_encode(array_column($tableObservations, 'S_no')));
        } else {
            error_log("[generateReport] NO observations found from {$tableName} for section {$section_id_for_frontend} with station_id={$internalStationId}");
        }
        
        // Filter by S_no prefix if specified (for shared tables like rfid_tags)
        if (isset($config['s_no_prefix'])) {
            $prefix = $config['s_no_prefix'];
            $beforeFilter = count($tableObservations);
            $tableObservations = array_filter($tableObservations, function($obs) use ($prefix) {
                return strpos($obs['S_no'], $prefix) === 0;
            });
            // Re-index array to avoid potential issues with array_merge later
            $tableObservations = array_values($tableObservations);
            $afterFilter = count($tableObservations);
            error_log("[generateReport] Filtered by prefix '{$prefix}': {$beforeFilter} -> {$afterFilter} observations");
        }

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
    error_log("[generateReport] PDOException: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    error_log("[generateReport] Exception: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>
