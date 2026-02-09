<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Debug logging
$logFile = __DIR__ . '/debug_section12.log';
file_put_contents($logFile, "[" . date('Y-m-d H:i:s') . "] POST DATA: " . json_encode($_POST) . "\n", FILE_APPEND);

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (
            isset($_POST['station-id'], $_POST['section-id'], $_POST['observations'],
                  $_POST['station-name'], $_POST['zone'],
                  $_POST['division'], $_POST['section-name'], $_POST['initial-date'], $_POST['updated-date'])
        ) {
            // Database connection
            $pdo = new PDO('mysql:host=localhost;dbname=station_info', 'root', 'Hbl@1234');
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            // Fetch form data
            $stationId = $_POST['station-id']; // External station code
            $sectionID = $_POST['section-id'];
            $stationName = $_POST['station-name'];
            $zone = $_POST['zone'];
            $division = $_POST['division'];
            $sectionName = $_POST['section-name'];
            $initialDate = $_POST['initial-date'];
            $updatedDate = $_POST['updated-date'];
            $observations = json_decode($_POST['observations'], true);

            // Validate observations data
            if (!$observations || !is_array($observations)) {
                file_put_contents($logFile, "[" . date('Y-m-d H:i:s') . "] INVALID OBSERVATIONS: " . json_encode($observations) . "\n", FILE_APPEND);
                echo json_encode(['success' => false, 'message' => 'Invalid observation data']);
                exit;
            }
            file_put_contents($logFile, "[" . date('Y-m-d H:i:s') . "] Processing " . count($observations) . " observations\n", FILE_APPEND);

            // Get the internal station.id for the given station_code
            $stationIdQuery = $pdo->prepare("SELECT id FROM station WHERE station_id = ?");
            $stationIdQuery->execute([$stationId]);
            $stationRow = $stationIdQuery->fetch(PDO::FETCH_ASSOC);

            if (!$stationRow) {
                file_put_contents($logFile, "[" . date('Y-m-d H:i:s') . "] STATION NOT FOUND: " . $stationId . "\n", FILE_APPEND);
                echo json_encode(['success' => false, 'message' => 'Station not found in database']);
                exit;
            }
            $internalStationId = $stationRow['id'];
            file_put_contents($logFile, "[" . date('Y-m-d H:i:s') . "] Found station: external=" . $stationId . ", internal=" . $internalStationId . "\n", FILE_APPEND);

            // Delete existing observations for this section (11.x) to verify duplicates
            $deleteStmt = $pdo->prepare("DELETE FROM outdoor_cabling WHERE station_id = ? AND S_no LIKE '11.%'");
            $deleteStmt->execute([$stationId]);

            // Loop through each observation
            foreach ($observations as $obs) {
                // Insert into outdoor_cabling table
                                $stmt = $pdo->prepare("INSERT INTO outdoor_cabling (
                    station_id,     
                     observation_text, requirement_text, remarks, S_no,
                    observation_status,  created_at
                ) VALUES (?, ?, ?, ?, ?, ?, NOW())");

                                $stmt->execute([
                    $stationId,
                    htmlspecialchars($obs['observation_text']),
                    htmlspecialchars($obs['requirement_text'] ?? ''),
                    htmlspecialchars($obs['remarks']),
                    htmlspecialchars($obs['S_no']),
                    htmlspecialchars($obs['observation_status'])
    ]);

                // Update images in images table:
                if (!empty($obs['image_paths']) && is_array($obs['image_paths'])) {
                    $deleteStmt = $pdo->prepare("DELETE FROM images WHERE station_id = ? AND s_no = ? AND entity_type = ?");
                    $deleteStmt->execute([$stationId, $obs['S_no'], 'outdoor_cabling']);

                    foreach ($obs['image_paths'] as $imgPath) {
                        $imgStmt = $pdo->prepare("INSERT INTO images (entity_type, station_id, s_no, image_path, created_at) VALUES (?, ?, ?, ?, NOW())");
                        $imgStmt->execute(['outdoor_cabling', $stationId, $obs['S_no'], $imgPath]);
                    }
                }
            }

            echo json_encode(['success' => true, 'message' => 'Observations and images saved.']);
            file_put_contents($logFile, "[" . date('Y-m-d H:i:s') . "] SUCCESS: Observations saved\n", FILE_APPEND);
        } else {
            $missingFields = [];
            if (!isset($_POST['station-id'])) $missingFields[] = 'station-id';
            if (!isset($_POST['section-id'])) $missingFields[] = 'section-id';
            if (!isset($_POST['observations'])) $missingFields[] = 'observations';
            if (!isset($_POST['station-name'])) $missingFields[] = 'station-name';
            if (!isset($_POST['zone'])) $missingFields[] = 'zone';
            if (!isset($_POST['division'])) $missingFields[] = 'division';
            if (!isset($_POST['section-name'])) $missingFields[] = 'section-name';
            if (!isset($_POST['initial-date'])) $missingFields[] = 'initial-date';
            if (!isset($_POST['updated-date'])) $missingFields[] = 'updated-date';
            
            file_put_contents($logFile, "[" . date('Y-m-d H:i:s') . "] MISSING FIELDS: " . json_encode($missingFields) . "\n", FILE_APPEND);
            echo json_encode(['success' => false, 'message' => 'Missing fields: ' . implode(', ', $missingFields)]);
        }
    }
} catch (Exception $e) {
    $errorMsg = 'Server error: ' . $e->getMessage();
    file_put_contents($logFile, "[" . date('Y-m-d H:i:s') . "] ERROR: " . $errorMsg . "\n", FILE_APPEND);
    echo json_encode(['success' => false, 'message' => $errorMsg]);
}