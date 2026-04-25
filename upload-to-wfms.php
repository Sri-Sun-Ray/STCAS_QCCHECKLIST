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

// WFMS Base URL
$wfmsBaseUrl = "https://eg.hbl.in/wfms/api"; 

try {
    // Database connection using parameters from existing files
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
        echo json_encode(['success' => false, 'message' => 'Report file not found on server.']);
        exit;
    }

    // 2. Resolve stationId -> stationName (WFMS API)
    $stationRes = callWFMSAPI("GET", "$wfmsBaseUrl/getStationById?stationId=" . urlencode($stationId));
    if (!$stationRes || !isset($stationRes['stationName'])) {
        echo json_encode(['success' => false, 'message' => 'Station not found in WFMS.']);
        exit;
    }
    $stationName = $stationRes['stationName'];

    // 3. Use Fixed Constants for Activity and File Mapping
    $activityName = WFMS_ACTIVITY;
    $fileName = WFMS_FILE;

    // 4. Validate the “slot” exists in WFMS
    $filesRes = callWFMSAPI("POST", "$wfmsBaseUrl/getStationFiles", [
        "stationName" => $stationName,
        "files" => [[
            "activity" => $activityName,
            "files" => [$fileName]
        ]]
    ]);

    if (empty($filesRes)) {
        echo json_encode(['success' => false, 'message' => 'Invalid activity/file mapping in WFMS. Check if Wayside QA Audit is configured.']);
        exit;
    }

    // 5. Compare hash to avoid duplicate uploads
    $localHash = hash_file('sha256', $filePath);
    if ($localHash === $report['last_uploaded_hash']) {
        echo json_encode(['success' => true, 'message' => 'Already up to date in WFMS.']);
        exit;
    }

    // 6. Upload to WFMS
    $uploadRes = uploadFileToWFMS("$wfmsBaseUrl/postStationFile", [
        "stationName" => $stationName,
        "activityName" => $activityName,
        "fileName" => $fileName
    ], $filePath);

    if ($uploadRes && isset($uploadRes['success']) && $uploadRes['success']) {
        // 7. Update local record
        $updateStmt = $pdo->prepare("UPDATE report SET last_uploaded_hash = :hash WHERE id = :id");
        $updateStmt->execute(['hash' => $localHash, 'id' => $reportId]);
        
        echo json_encode(['success' => true, 'message' => 'Uploaded successfully to WFMS.']);
    } else {
        $errorMsg = $uploadRes['message'] ?? 'Unknown WFMS error.';
        echo json_encode(['success' => false, 'message' => "WFMS Upload Failed: $errorMsg"]);
    }

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}


/**
 * Helper to call WFMS JSON APIs
 */
function callWFMSAPI($method, $url, $data = null) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    
    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode >= 200 && $httpCode < 300) {
        return json_decode($response, true);
    }
    return null;
}

/**
 * Helper to upload file to WFMS via Multipart Form
 */
function uploadFileToWFMS($url, $fields, $filePath) {
    $ch = curl_init();
    
    // Add file to fields
    $fields['file'] = new CURLFile(realpath($filePath));
    
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 60);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode >= 200 && $httpCode < 300) {
        return json_decode($response, true);
    }
    return ['success' => false, 'message' => "HTTP Status Code: $httpCode"];
}
?>
