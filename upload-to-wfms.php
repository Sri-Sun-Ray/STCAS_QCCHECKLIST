<?php
session_start();
header('Content-Type: application/json');

// Define WFMS Constants as per Requirement
define("WFMS_ACTIVITY", "Wayside QA Audit");
define("WFMS_FILE", "Wayside QA Audit Report");

// Ensure user is logged in
if (!isset($_SESSION['username'])) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized access. Please log in.']);
    exit;
}

$reportId = $_POST['reportId'] ?? null;
$stationId = $_POST['stationId'] ?? null;

if (!$reportId || !$stationId) {
    echo json_encode(['success' => false, 'message' => 'Missing required parameters (reportId or stationId).']);
    exit;
}

// WFMS Base URL (Local)
$wfmsBaseUrl = "https://wfms.upskill365.com/api"; 

// Get data from Frontend
$wfmsToken = $_POST['wfms_token'] ?? '';
$wfmsStationName = $_POST['wfms_station_name'] ?? '';

if (!$wfmsToken || !$wfmsStationName) {
    echo json_encode(['success' => false, 'message' => 'WFMS Authentication or Station selection missing.']);
    exit;
}

try {
    // Database connection
    $pdo = new PDO("mysql:host=localhost;dbname=station_info", 'root', 'Hbl@1234');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 1. Get Report Details
    $stmt = $pdo->prepare("SELECT file_name, last_uploaded_hash FROM report WHERE id = :id");
    $stmt->execute(['id' => $reportId]);
    $report = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$report) {
        echo json_encode(['success' => false, 'message' => 'Report not found in local database.']);
        exit;
    }

    $filePath = 'uploads/reports/' . $report['file_name'];
    if (!file_exists($filePath)) {
        echo json_encode(['success' => false, 'message' => 'Report file found in DB but missing on disk.']);
        exit;
    }

    // 2. PUSH FILE (PDF) to the specific assigned activity in WFMS
    $fields = [
        "stationName" => $wfmsStationName,
        "activityName" => WFMS_ACTIVITY, // "Wayside QA Audit"
        "fileName" => WFMS_FILE       // "Wayside QA Audit Report"
    ];

    $uploadRes = uploadWithUserToken("$wfmsBaseUrl/station-file", $fields, $filePath, $wfmsToken);

    if ($uploadRes && isset($uploadRes['status']) && $uploadRes['status']) {
        // 3. Update local record
        $localHash = hash_file('sha256', $filePath);
        $updateStmt = $pdo->prepare("UPDATE report SET last_uploaded_hash = :hash WHERE id = :id");
        $updateStmt->execute(['hash' => $localHash, 'id' => $reportId]);
        
        echo json_encode(['success' => true, 'message' => 'Report pushed to WFMS Wayside activity successfully!']);
    } else {
        $errorMsg = $uploadRes['message'] ?? 'WFMS rejected the upload. Ensure activity name is exact.';
        echo json_encode(['success' => false, 'message' => "WFMS Error: $errorMsg"]);
    }

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}

/**
 * Helper: Upload file to WFMS using User Token
 */
function uploadWithUserToken($url, $fields, $filePath, $token) {
    $ch = curl_init($url);
    $fields['file'] = new CURLFile(realpath($filePath));

    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $token,
        'x-app-module: WFMS2'
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return json_decode($response, true);
}
?>
