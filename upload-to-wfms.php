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
$reportFileName = $_POST['fileName'] ?? $_POST['file_name'] ?? null;

// WFMS Base URL (Local)
$wfmsBaseUrl = "https://eg.hbl.in:5100/api"; 

// Get data from Frontend
$wfmsToken = $_POST['wfms_token'] ?? '';
$wfmsStationName = $_POST['wfms_station_name'] ?? '';

if (!$wfmsToken || !$wfmsStationName || $wfmsStationName === 'undefined') {
    echo json_encode(['success' => false, 'message' => 'WFMS Authentication or Station selection missing. Please select a station from the dropdown.']);
    exit;
}

try {
    // Database connection
    $pdo = new PDO("mysql:host=localhost;dbname=station_info", 'root', 'Hbl@1234');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 1. Get Report Details (try by reportId, fallback to fileName)
    $report = null;
    if ($reportId && $reportId !== 'undefined' && $reportId !== 'null' && $reportId !== '') {
        $stmt = $pdo->prepare("SELECT id, file_name, last_uploaded_hash FROM report WHERE id = :id");
        $stmt->execute(['id' => $reportId]);
        $report = $stmt->fetch(PDO::FETCH_ASSOC);
    }

    if (!$report && $reportFileName) {
        $stmt = $pdo->prepare("SELECT id, file_name, last_uploaded_hash FROM report WHERE file_name = :fname");
        $stmt->execute(['fname' => $reportFileName]);
        $report = $stmt->fetch(PDO::FETCH_ASSOC);
    }

    if (!$report) {
        echo json_encode(['success' => false, 'message' => 'Report not found in local database.']);
        exit;
    }

    $reportId = $report['id'];

    $filePath = 'uploads/reports/' . $report['file_name'];
    if (!file_exists($filePath)) {
        echo json_encode(['success' => false, 'message' => 'Report file found in DB but missing on disk.']);
        exit;
    }

    $activityId = $_POST['activityId'] ?? null;
    $docId = $_POST['docId'] ?? null;

    // 1. Direct Activity Document Upload (Advances WFMS Portal UI Revision)
    $actUploadRes = null;
    if ($activityId && $docId) {
        $actFields = [
            "activityId" => $activityId,
            "docId" => $docId
        ];
        $actUploadRes = uploadWithUserToken("$wfmsBaseUrl/activity/upload", $actFields, $filePath, $wfmsToken);
    }

    // 2. Station File Record Linkage
    $fields = [
        "stationName" => $wfmsStationName,
        "activityName" => WFMS_ACTIVITY, // "Wayside QA Audit"
        "fileName" => WFMS_FILE       // "Wayside QA Audit Report"
    ];
    $stationUploadRes = uploadWithUserToken("$wfmsBaseUrl/station-file", $fields, $filePath, $wfmsToken);

    $isSuccess = ($actUploadRes && isset($actUploadRes['status']) && $actUploadRes['status']) ||
                 ($stationUploadRes && isset($stationUploadRes['status']) && $stationUploadRes['status']);

    if ($isSuccess) {
        // 3. Update local record
        $localHash = hash_file('sha256', $filePath);
        $updateStmt = $pdo->prepare("UPDATE report SET last_uploaded_hash = :hash WHERE id = :id");
        $updateStmt->execute(['hash' => $localHash, 'id' => $reportId]);
        
        echo json_encode(['success' => true, 'message' => 'Report pushed to WFMS Wayside activity successfully!']);
    } else {
        $errorMsg = $actUploadRes['message'] ?? $stationUploadRes['message'] ?? 'WFMS rejected the upload.';
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
    $fields['file'] = new CURLFile(realpath($filePath), 'application/pdf', basename($filePath));

    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $token,
        'x-app-module: WFMS2'
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);

    $logMsg = "[" . date('Y-m-d H:i:s') . "] POST $url\n";
    $logMsg .= "Fields: " . json_encode(array_diff_key($fields, ['file' => 1])) . "\n";
    $logMsg .= "File: " . realpath($filePath) . "\n";
    $logMsg .= "HTTP Code: $httpCode\n";
    $logMsg .= "cURL Error: " . ($err ?: "None") . "\n";
    $logMsg .= "Response: " . $response . "\n";
    $logMsg .= "----------------------------------------\n";
    file_put_contents(__DIR__ . '/wfms_debug.log', $logMsg, FILE_APPEND);

    return json_decode($response, true);
}
?>
